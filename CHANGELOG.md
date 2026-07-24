# Changelog

All notable changes to CheckInInsights. Versions match the Rock Shop package versions.

## v1.0.1

- **Fixed fresh installs not creating the plugin pages.** The install migration now registers the three block types before placing block instances. Rock runs plugin migrations before its automatic block-type registration, so on a clean install the migration's page setup failed and rolled back (block types still appeared afterward, which is why manual placement worked). Installs that hit this on 1.0.0 self-heal on the first restart after updating: the migration runs and creates the pages and job.
- Improved dark mode support on the Check-in Timeline: hour gridlines, header controls, and the legend now follow the theme.
- Restyled the Timeline's detail panel to match Rock's docked panel look: rounded, shadowed, and sitting below the header.
- Removed the legacy / Next-Gen color coding. It relied on naming conventions, so it wasn't reliable enough to keep.
- Compatibility improvements for older Rock versions (compiled against Rock 1.16; replaced a Rock-internal UI control with a self-contained equivalent).

## v1.0.0

Initial release.

- **Check-in Timeline.** Per-room schedule timeline for any date with live check-in counts, a current-time line, possible double-booking flags, and a slide-over detail panel with fix links. Mobile friendly.
- **Rooms & Schedules.** Filterable cross-reference of every group + room + schedule pairing, with fix links and searchable filters.
- **Check-in Status Overview.** Scans check-in configuration for setup problems across six rules, each finding linked to the admin page where you fix it.
- **Status Digest job.** Daily scan that emails configured recipients only when something newly broke.
- Read-only throughout: no writes to check-in data, no custom tables.
