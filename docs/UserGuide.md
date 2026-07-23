# CheckInInsights User Guide

CheckInInsights is a Rock RMS plugin that adds visibility tooling around check-in. It reads the same configuration both check-in engines use (areas, groups, rooms, schedules) and turns it into three admin views plus an email watchdog. It never writes to your check-in data, so there is nothing it can break.

This guide covers installation, each tool, and day-to-day use. For architecture and developer-level detail, see `TechnicalSpec.md`. For removal, see `Uninstall.md`.

---

## Contents

1. [What it does](#what-it-does)
2. [Installation](#installation)
3. [First-time setup](#first-time-setup)
4. [Check-in Timeline](#check-in-timeline)
5. [Rooms & Schedules](#rooms--schedules)
6. [Check-in Status Overview](#check-in-status-overview)
7. [The Status Digest job](#the-status-digest-job)
8. [Filters and saved preferences](#filters-and-saved-preferences)
9. [Troubleshooting](#troubleshooting)
10. [Limitations and caveats](#limitations)

---

## What it does

Check-in configuration lives across four layers (check-in configuration → areas → groups → rooms + schedules), and Rock's admin UI shows you one layer at a time. These tools show you the whole picture at once:

- **Check-in Timeline** answers "what is happening, where, and when" for any date. Rooms down the side, hours across the top, one block per group + room + schedule window. On today's date it also shows live check-in counts and refreshes itself every minute.
- **Rooms & Schedules** answers "what is tied to what". Every group + room + schedule pairing as one filterable grid. Filter the Schedule column to see everything a schedule serves; filter the Room column to see everything using a room. Incomplete pairings (no room, no schedule) stay visible so gaps can't hide.
- **Check-in Status Overview** answers "what is broken or risky". Six rules scan the whole configuration and list findings by severity, each linked to the exact admin page where you fix it.

Everything works identically whether an area runs on legacy check-in or Next-Gen check-in, because both engines share the same underlying data.

---

## Installation

1. Copy `com.yesuchum.CheckInInsights.dll` into `RockWeb/Bin/`.
2. Copy the three `*.obs.js` bundles (plus `.map` files) into `RockWeb/Plugins/com_yesuchum/CheckInInsights/`.
3. Restart the Rock application (full restart, not just a recycle-on-touch; plugin migrations only run at startup).

The startup migration:

- Creates **Admin Tools > Installed Plugins > Check-in Insights** (icon `ti ti-calendar-time`) with a landing page listing the three tools as cards, plus one child page per tool with its block already placed.
- Registers the three block types under the **Yesu Chum > Check-in Insights** category.
- Registers the **Check-in Insights: Status Digest** job (daily 6:00 AM, silent until you configure recipients).

No database tables are created. The plugin is read-only.

---

## First-time setup

A fresh install boots ready to use. There is nothing to configure before the tools work, but two things are worth doing:

1. **Open the Timeline on a recent Sunday** and confirm the picture matches reality. This is the fastest way to sanity-check that your check-in tree is what you think it is.
2. **Put your email on the Status Digest job** (Admin Tools > Jobs > Check-in Insights: Status Digest > Recipient Emails) if you want to be told when setup problems appear. Until you do, the job runs silently and sends nothing.

Optionally, review each block's settings (gear icon > Block Properties). All three blocks have **Group Detail Page**, **Location Detail Page**, and **Schedule Detail Page** settings controlling where their fix links land. The defaults point at Rock's core admin pages (Group Viewer, Named Locations under Check-in, Schedules under Check-in) and rarely need changing.

---

## Check-in Timeline

Rooms down the side, grouped by area. Hours across the top. One colored block per schedule window: blue for legacy check-in, green for Next-Gen.

### Header controls

| Control | What it does |
|---|---|
| Date picker | The date to display. Defaults to today. Changing it reloads immediately; no button to press. |
| Calendar-share icon | Jumps to the next upcoming Sunday (stays put if you're already on one). |
| Warning-triangle icon | Shows / hides the possible-double-booking outlines. Highlighted while on. |
| Sliders icon | Opens the filters (Campuses, Configurations, Group Types). Highlighted while any filter is active. |

### Reading the blocks

- Each block spans that schedule's **check-in window** for the day and is labeled with the group name.
- A **count chip** on the block is the number of people actually checked in for that group + room + schedule on the displayed date. No chip means no attendance occurrence exists (different from a zero).
- A **red outline** marks a possible double-booking. See below for exactly what that means.
- When viewing today, a red vertical **now line** marks the current time, and the whole view refreshes every minute so the counts stay live. Other dates are static.

### The detail panel

Click any block and a panel slides in from the right (the same style as Rock's Connections list). It shows the full window detail (schedule, check-in and event times, configuration, area), the room detail (checked-in count against capacity with a color bar, soft and firm thresholds), and **Also in this room today**: every other window sharing that room on that date. Click any of those rows to jump the panel to that window. The header buttons open the group, room, or schedule admin pages directly.

### What "possible double-booking" means

The flag is deliberately narrow so it stays worth looking at. A window is flagged only when ALL of these are true:

- same room,
- same check-in configuration,
- a **different group**,
- a **different schedule**,
- and the two **event times** (not the check-in windows) overlap.

Things that are *not* flagged, on purpose: one schedule serving two groups in a room (combined class), a serving-team schedule and a kids schedule sharing a room (different configurations, expected co-location), and consecutive services whose generous check-in windows overlap (that's how early check-in works). What survives the filter is usually a data-entry mistake, like the wrong room on a schedule. Verify with the detail panel's "Also in this room today" list, which marks the conflicting partner with a warning triangle.

---

## Rooms & Schedules

Every group + room + schedule pairing for your whole check-in tree as one grid. It loads everything on page load; scoping happens through filters.

| Column | Notes |
|---|---|
| Campus | Derived from the group when it has one, otherwise from the room's location tree. |
| Configuration | The check-in configuration (template) the pairing belongs to. |
| Area | The path from the configuration down to the group's area. |
| Group | Links to the group's admin page. |
| Location | Links to the room's admin page. A red **No location** label means the group has no room at all. |
| Schedule | Links to the schedule's admin page. An orange **No schedule** label means the room is attached but never opens. |
| Capacity | The capacity set on this specific group + room + schedule pairing. When the pairing has none, the room's own threshold shows instead as a muted "N (room)". Hover either for an explanation. |

The two lookup directions:

- **"What does the 9:00 schedule serve?"** Filter the Schedule column (or use the filters modal) to that schedule. Every group and room it drives is what remains.
- **"When is Bears Room used?"** Filter the Location column to the room. Every schedule touching it is what remains.

---

## Check-in Status Overview

Six rules scan every configuration, area, group, room, and schedule, and each finding becomes a row. Severity meanings:

| Severity | Meaning |
|---|---|
| **Error** | Check-in cannot work for this item. Fix it. |
| **Warning** | Check-in works but something protective is missing. |
| **Info** | Worth knowing; may be intentional. |

The rules:

| Rule | Severity | What it caught |
|---|---|---|
| Group has no location | Error | The group can never appear as a check-in option. |
| Location has no schedule | Error | The room is attached but never opens for check-in. |
| Area has no active groups | Warning | A leaf area with nothing in it; nothing can check in there. |
| Location has no room thresholds | Warning | Neither soft nor firm threshold is set, so the room never closes when full. |
| Location has no printer | Info | Labels only print if a kiosk or ancestor location provides a printer. |
| Schedule has no capacity settings | Info | No minimum / desired / maximum capacity on the pairing. |

Group, Location, and Schedule columns link straight to the admin page where the fix happens. The grid loads all campuses; use the filters (sliders icon) to scope by Campus, Severity, Rule, or Group Type.

---

## The Status Digest job

**Admin Tools > Jobs > Check-in Insights: Status Digest.** Registered by the installer, scheduled daily at 6:00 AM, and completely silent until you give it recipients.

What a run does, in order:

1. Re-runs the same scan as the Status Overview page, across all campuses.
2. Compares the findings against what the previous run saw.
3. If anything **new** appeared, emails the configured recipients a table of just the new findings. If nothing new appeared (even if long-standing issues still exist), no email.
4. Records the current findings for the next run's comparison.

It reads configuration and sends email. It never changes any data.

| Job setting | What it does |
|---|---|
| Recipient Emails | Who gets the alert. Comma-separated. Blank = the job runs but never sends. |
| Include Warnings | Off by default: only new Errors trigger an email. On: new Warnings do too. |

**To test it:** put your email in Recipient Emails, run the job manually twice from the Jobs page. The first run emails you every current Error (they're all "new" to a first run); the second run reports "no new issues" and sends nothing. That's the whole mechanism proven.

---

## Filters and saved preferences

All three tools use the same filter pattern: the **sliders icon** (in the grid header, or the Timeline's panel header) opens an **Apply Filters** modal of searchable multi-select dropdowns. Leave a dropdown empty to include everything; type in it to find a specific campus, room, or schedule quickly. The icon stays highlighted while any filter is active.

Your filter selections (and the Timeline's double-booking toggle) are saved as personal preferences per block. They survive page reloads and are yours alone; they don't affect other staff.

---

## Troubleshooting

**A tool page is empty / block shows an error after install.** Plugin block types register at application startup. Do a full app restart (not just saving web.config), then reload.

**The Campus column is blank for some rows.** The plugin derives campus from the group first, then by walking the room's location tree up to a campus root. If a room isn't under any campus's location tree and its group has no campus, the campus is genuinely unknowable and shows blank. Those rows are always included when filtering by campus so they can't hide.

**Schedule names look like "Sunday 9:00am" instead of what I named them.** Most check-in schedules have no name at all in the database; they're inline calendar entries. The plugin computes a friendly label from the schedule's actual calendar content. If a schedule *does* have a name, that name is used.

**A count chip is missing on the Timeline.** No attendance occurrence exists for that exact group + room + schedule on that date. That's normal for future dates and for windows nobody has checked into yet.

**Blocks appear at midnight (12a) on the Timeline.** That schedule's calendar content resolves to a midnight window, usually a schedule created without a meaningful time. The Timeline is showing you the data as it really is; fix the schedule.

**The digest job says "Warning" status but I got no email.** Check the job's history detail. "No recipient emails configured" means findings existed but nowhere to send them.

---

## Limitations

- **Next-Gen detection is name-based.** A configuration is treated as Next-Gen when its name contains "NextGen". Rock does not currently expose a public API flag for this. If your naming convention differs, the legacy / Next-Gen coloring on the Timeline will be wrong (everything else is unaffected).
- **Read-only, by design.** Nothing here edits configuration. Fix links take you to the core admin pages; the fixing happens there.
- **The digest's memory is name-based.** Renaming an area, group, or room makes its existing findings look "new" to the next digest run. Expect a one-time re-alert after big renames.
- **Rock 20.0 is the tested baseline.** The Timeline's slide-over detail panel uses a Rock internal UI control; re-verify it after major Rock upgrades.
