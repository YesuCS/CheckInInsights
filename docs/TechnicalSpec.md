# CheckInInsights Technical Specification

Architecture and developer-level reference. For day-to-day usage see `UserGuide.md`. For removal see `Uninstall.md`.

---

## Contents

1. [Architecture overview](#architecture-overview)
2. [CheckInConfigService](#checkinconfigservice)
3. [Blocks and GUIDs](#blocks-and-guids)
4. [The Status Digest job](#the-status-digest-job)
5. [Frontend](#frontend)
6. [Plugin migration](#plugin-migration)
7. [Build and deploy](#build-and-deploy)
8. [Gotchas](#gotchas)

---

## Architecture overview

One shared read-only engine, three thin Obsidian blocks over it, one job reusing the same engine:

```
CheckInConfigService (Services/)
  ├── BuildConcurrency(campusId?, date)  →  Check-in Timeline block
  ├── BuildAssignments(campusId?)        →  Rooms & Schedules block
  └── BuildLintIssues(campusId?)         →  Status Overview block
                                            └── SendStatusDigest job
```

Everything is computed on demand from Rock's own tables (GroupType, Group, GroupLocation, Schedule, GroupLocationScheduleConfig, Location, AttendanceOccurrence). No plugin tables, no caching layer beyond Rock's entity caches, no writes. All queries are `AsNoTracking()`.

Both check-in engines (legacy and Next-Gen) drive off the same configuration schema, which is why one engine serves both.

## CheckInConfigService

`Services/CheckInConfigService.cs`. Instantiated per request with a `RockContext`; never used as a singleton (it holds lazy per-request lookup dictionaries).

### The config walk

1. Resolve the **Check-in Template** purpose via `Rock.SystemGuid.DefinedValue.GROUPTYPE_PURPOSE_CHECKIN_TEMPLATE`, then take every `GroupTypeCache` with that purpose as a configuration ("template").
2. Recursively walk each template's `ChildGroupTypes` to enumerate **areas**, tracking the human-readable area path. A visited set guards against cycles (check-in trees can contain them). The same area under two templates yields one entry per pairing so findings attribute to the right configuration.
3. Load all **active groups** in those area group types in one query, with `GroupLocations.Location`, `.Schedules`, and `.GroupLocationScheduleConfigs` included.

### Campus resolution (the important subtlety)

Check-in groups frequently have `Group.CampusId = null`; their campus is implied by their room. `GetCampusName(group, groupLocation)` therefore resolves campus as:

1. `Group.CampusId` when present, else
2. walk the room's **named-location ancestor chain** upward (lazy dictionary of `Location.Id → ParentLocationId` for named locations only, which keeps the map small since address locations are unnamed) until an ancestor matches some campus's `Campus.LocationId`. Bounded at 20 hops against data cycles.

All campus **scoping is done in memory** against the derived name, never in SQL against `Group.CampusId`. Rows whose campus cannot be derived are always kept in scope so misconfigured data stays visible.

### Schedule labels

`Schedule.Name` is null for most check-in schedules (they're inline iCal). `GetScheduleLabel` uses the name when present, else `ToFriendlyScheduleText(true)`, else `"Custom Schedule"`. Never display `Schedule.Name` raw.

### BuildConcurrency

Expands each schedule with `Schedule.GetCheckInTimes(date)` (returns `CheckInTimes` with `Start/End/CheckInStart/CheckInEnd`), producing one `ScheduleWindowBag` per template pairing per occurrence. Then:

- **Double-booking flag.** A pair of windows is flagged when: same `LocationId` AND same template AND different group AND different schedule AND **event** times overlap (`a.Start < b.End && b.Start < a.End`). Check-in windows are deliberately not compared; they overlap between services by design. Cross-template overlap (serving + kids in one room) is expected co-location and not flagged.
- **Attendance counts.** One query over `AttendanceOccurrence` for the date joins `Attendees.Count(a => a.DidAttend == true)` per `(GroupId, LocationId, ScheduleId)` onto the windows. Null count = no occurrence (distinct from 0).

### BuildAssignments

Every group + room + schedule pairing as a `ScheduleAssignmentBag`, including incomplete pairings (group with no `GroupLocation` → null room and schedule; `GroupLocation` with no schedules → null schedule) so the cross-reference shows gaps. Capacity is `GroupLocationScheduleConfig.MaximumCapacity ?? DesiredCapacity` (pairing level) with `RoomCapacity = Location.FirmRoomThreshold ?? SoftRoomThreshold` carried separately as the fallback.

### BuildLintIssues

The six rules documented in the user guide, emitted as `LintIssueBag` with separate Group / Location / Schedule members (name + IdKey each) so the client can render and link them independently. The area-empty rule only fires on **leaf** areas; parent areas legitimately hold no groups.

## Blocks and GUIDs

All three blocks are plain `RockBlockType` under namespace `com.yesuchum.CheckInInsights.Blocks`, category **Yesu Chum > Check-in Insights**. GUIDs are permanent; never change them.

| Block (class) | Display name | EntityTypeGuid | BlockTypeGuid |
|---|---|---|---|
| ScheduleConcurrencyMap | Check-in Timeline | 84B1D63E-98FB-42C0-8F1D-60087EBE659F | FB157587-409E-42E1-8445-8035940C1A0D |
| ScheduleCrossReference | Rooms & Schedules | EA8C9715-C38E-463C-B401-1DB9726B4B21 | FE7EBC7A-5D86-49B0-AB13-5189D1569F22 |
| CheckInConfigLint | Check-in Status Overview | 47CDCC18-CD2E-4DF0-8804-AEE79CD24AAE | FB3841FB-3D02-4B69-A0D4-66A09740D099 |

(The class names predate the layman renames; they are internal only and not worth a breaking rename.)

Each block:

- Returns a `CheckInInsightsInitBag` from `GetObsidianBlockInitialization` (active campuses + default date).
- Exposes one `[BlockAction]` (`GetConcurrency` / `GetAssignments` / `GetLintIssues`) whose filter bag's `CampusGuid` is optional; null means all campuses.
- Has three `[LinkedPage]` settings (Group / Location / Schedule Detail Page) defaulting to core's Group Viewer, Named Locations (Check-in), and Schedules (Check-in) pages. Fix links are built server-side: the row's IdKey is decoded via `IdHasher.Instance.GetId`, then `this.GetLinkedPageUrl(attributeKey, pageParams)` produces the URL. The client never sees raw ids outside those URLs.

## The Status Digest job

`Jobs/SendStatusDigest.cs`, class `com.yesuchum.CheckInInsights.Jobs.SendStatusDigest`, extends `RockJob`. Registered by the migration (ServiceJob guid `85F223E8-7C60-4D76-A528-6B923493B1B4`, cron `0 0 6 1/1 * ? *`).

Run logic: `BuildLintIssues(null)` → filter to Errors (+Warnings when the job attribute is on) → compute a stable key per issue (`Severity|Rule|Template|AreaPath|Group|Location|Schedule`) → diff against the previous run's key set, stored as JSON in Rock system settings under `com.yesuchum.CheckInInsights.StatusDigestSeenIssues` → always persist the current set → email only the new issues via `RockEmailMessage` with anonymous recipients. Because the key is name-based, renames re-trigger those issues once.

## Frontend

`com.yesuchum.CheckInInsights.Obsidian/`, standard Obsidian rollup workspace (same build-tools pipeline as core). TS types for the bags are hand-mirrored in `src/CheckInInsights/types.partial.ts`; no viewmodel codegen.

```
src/
  scheduleConcurrencyMap.obs           Check-in Timeline
  scheduleCrossReference.obs           Rooms & Schedules
  checkInConfigLint.obs                Status Overview
  CheckInInsights/
    types.partial.ts                   Bag mirrors
    filtersModal.partial.obs           Shared Apply Filters modal
    windowDetailPanel.partial.obs      Timeline slide-over detail panel
```

Conventions worth knowing:

- **Grids are the panel.** The two grid blocks render Rock's `<Grid>` as the top-level surface (no `Panel` wrapper; Grid draws its own chrome) with `gridSettings` / `gridSettingsActive` / `@gridSettingsClick` wiring the filters modal to the grid's built-in header settings icon.
- **Filters modal** (`filtersModal.partial.obs`) is generic: an array of `{ key, label, options }` sections rendered as multi-select `DropDownList`s with `enhanceForLongLists` always on. Empty selection = all. Applied selections persist per person as JSON under block preferences (`filter-<key>`); the Timeline's overlap toggle persists under `show-overlap-flags`.
- **All filtering is client-side.** Blocks load the full dataset (all campuses) once, then filter loaded rows. At our scale (hundreds to low thousands of rows) this is instant and keeps the block actions trivial.
- **The Timeline** lays windows out on a CSS timeline (percent-positioned blocks, lane-packing for overlaps within a room row), auto-loads on mount, reloads on date change, and when the viewed date is today: draws a now line and re-fetches every 60 seconds. Header controls live in the `Panel`'s `#headerActions` slot styled as `btn btn-grid-action` icons to match Grid header UX.
- **The detail panel** is a self-contained slide-over (`windowDetailPanel.partial.obs`) styled after core's Connections Hub request panel but with its own markup and CSS, deliberately avoiding Rock's internal `dockedPanel` control (which does not exist in v16 and could change in any release). Closes on outside click and Escape. (`useVModelPassthrough` trips vue-tsc from a plugin workspace; the panel uses an explicit ref + watch pair instead.)

## Plugin migration

One migration, `Migrations/_001_CreateCheckInInsights.cs`, `[MigrationNumber(1, "1.16")]`. Creates the page tree (landing page with Page Menu + three tool pages with their blocks) and inserts the ServiceJob row. Block types are NOT migration-registered; Rock reflects them from the DLL at startup. `Down()` removes the job, blocks, and pages.

This squashes four dev-era migrations; the GUIDs match the pre-squash values so a dev install that ran the originals recognizes the same rows.

Page / block instance GUIDs:

| Item | Guid |
|---|---|
| Check-in Insights (landing page) | C3152A92-9553-4C90-8316-55F2B0CAB12E |
| Check-in Timeline page / block | 42141E74-E6EA-4C1D-9A01-28A86496DAC1 / BB695DB5-880E-4A8A-825E-9B65FCD9C944 |
| Rooms & Schedules page / block | 0DB606C0-5CCC-4F98-BD26-39DBC03CEE03 / 4257056C-281A-4A9E-B18D-78A19E406D9D |
| Status Overview page / block | 690DECF7-8D63-4354-96E4-5C2CBED7F15A / 9523DD96-502A-479C-A879-D4B9B3B9B89B |
| Landing Page Menu block | 7FA7EAA2-F5A5-4247-B892-590542D2EF96 |
| Status Digest ServiceJob | 85F223E8-7C60-4D76-A528-6B923493B1B4 |

## Build and deploy

Development happens inside a Rock source tree; the csproj project-references `Rock`, `Rock.Common`, and `Rock.Enums` and auto-copies its DLL to `RockWeb/Bin` via `CopyToRockWeb`. The Obsidian workspace's rollup config copies bundles to `RockWeb/Plugins/com_yesuchum/CheckInInsights/`.

```
dotnet build com.yesuchum.CheckInInsights\com.yesuchum.CheckInInsights.csproj -c Debug
cd com.yesuchum.CheckInInsights.Obsidian
npm run type-check        # vue-tsc
npm run build             # rollup, copies to RockWeb
```

Then restart the Rock app. Frontend-only changes need only a browser refresh; DLL changes need the restart; migration changes need the restart (migrations run once at startup and are recorded in PluginMigration).

## Gotchas

- **Plugin migrations only run on full app restart.** A DLL rebuild alone won't trigger them.
- **`Schedule.Name` is usually null.** Always go through `GetScheduleLabel`.
- **`Group.CampusId` is usually null for check-in groups.** Always go through `GetCampusName`; never filter campus in SQL.
- **Don't compare check-in windows for conflicts.** They overlap between services by design; compare event times.
- **`GroupTypeCache.GetCheckInConfiguration` is internal**, so Next-Gen detection falls back to the name heuristic ("NextGen" substring). Revisit when Rock exposes a public discriminator.
- **No Rock internal Obsidian controls are used.** The Timeline detail panel is self-contained specifically so v16 frameworks (no `dockedPanel`) and future framework churn can't break it.
- **Block classes and display names diverge** (ScheduleConcurrencyMap = Check-in Timeline, CheckInConfigLint = Check-in Status Overview). GUIDs, not names, are the identity; do not rename-and-re-guid.
