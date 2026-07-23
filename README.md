# CheckInInsights

Self-contained Rock RMS Obsidian plugin that adds companion tooling *around* check-in, for churches running legacy check-in, Next-Gen check-in, or (like us) both at once during a migration. It is read-only against your configuration: three admin blocks and one watchdog job, zero writes to production data, zero custom tables.

The three tools:

- **Check-in Timeline.** A visual timeline of every check-in schedule per room for any date, with live check-in counts, a now line, and flags for possible double-bookings.
- **Rooms & Schedules.** A filterable cross-reference of every group + room + schedule pairing, answering "what does this schedule serve?" and "when is this room used?" in either direction.
- **Check-in Status Overview.** A findings list of setup problems: groups without rooms, rooms without schedules, missing printers, missing thresholds, missing capacities, empty areas.

Plus the **Status Digest** job, which re-runs the status scan on a schedule and emails you only when something *newly* broke.

## Documentation

- [User Guide](docs/UserGuide.md). Install, each tool in depth, the digest job, filters and preferences, troubleshooting, limitations.
- [Technical Specification](docs/TechnicalSpec.md). Architecture, the shared config-walking service, campus resolution, the double-booking rule, block/GUID reference, build and deploy, gotchas.
- [Uninstall Guide](docs/Uninstall.md). Clean removal, post-uninstall housekeeping, verification checklist.

## Repo layout

```
com.yesuchum.CheckInInsights/            C# class library: blocks, the shared
                                         CheckInConfigService, the Status Digest
                                         job, view-model bags, plugin migration.
com.yesuchum.CheckInInsights.Obsidian/   Vue 3 plus TypeScript Obsidian
                                         frontends for the three block types.
docs/                                    User guide, technical spec, uninstall.
```

## Build

C# class library:

```
dotnet build com.yesuchum.CheckInInsights
```

Obsidian frontends (one-time `npm install`, then rebuild on each change):

```
cd com.yesuchum.CheckInInsights.Obsidian
npm install
npx rollup -c rollup.config.cjs
```

Outputs:

- `com.yesuchum.CheckInInsights\bin\Debug\net472\com.yesuchum.CheckInInsights.dll`
- `com.yesuchum.CheckInInsights.Obsidian\dist\*.obs.js`

These deploy into a Rock install as described in `docs/TechnicalSpec.md`.

## Rock version

Developed and tested against Rock McKinley 20.0. The plugin declares a 1.16 minimum in its migration, but anything below what we actually run is untested. Both check-in engines share the data model this plugin reads, so it behaves identically for legacy and Next-Gen configurations.
