# CheckInInsights Uninstall Guide

How to cleanly remove CheckInInsights from a Rock install. The good news: this plugin creates **no database tables** and never writes to your check-in data, so uninstalling is simpler than most plugins. It's a matter of removing pages, block instances, one job, one stored setting, and the files.

For day-to-day usage see `UserGuide.md`. For architecture see `TechnicalSpec.md`.

---

## Contents

1. [Before you uninstall](#before-you-uninstall)
2. [Uninstall steps](#uninstall-steps)
3. [Post-uninstall housekeeping](#post-uninstall-housekeeping)
4. [Verification checklist](#verification-checklist)
5. [Reinstalling later](#reinstalling-later)

---

## Before you uninstall

### Find block instances placed outside the install-created pages

The installer created three pages with one block each under **Admin Tools > Installed Plugins > Check-in Insights**. If admins placed additional instances of the blocks on other pages (a Timeline on a dashboard, for example), those become broken-block placeholders after removal. Find every instance first:

```sql
SELECT b.Id, b.Name, p.InternalName AS PageName
FROM [Block] b
JOIN [Page] p ON p.Id = b.PageId
JOIN [BlockType] bt ON bt.Id = b.BlockTypeId
JOIN [EntityType] et ON et.Id = bt.EntityTypeId
WHERE et.[Name] LIKE 'com.yesuchum.CheckInInsights.%'
```

For each row on a page you created yourself: navigate there, gear icon, **Delete Block**.

### Note your digest recipients

If the Status Digest job has been alerting people, tell them it's going away. Nothing else depends on the plugin.

---

## Uninstall steps

1. **Delete the pages.** In **Admin Tools > Pages** (or from the page itself via Page Properties), delete the **Check-in Insights** page under Installed Plugins. Deleting the parent removes the three child pages and the block instances they host.
2. **Delete the job.** **Admin Tools > Jobs**, find **Check-in Insights: Status Digest**, delete it.
3. **Delete the block types.** **Admin Tools > CMS Configuration > Block Types**, filter by the **Yesu Chum > Check-in Insights** category, delete the three entries (Check-in Timeline, Rooms & Schedules, Check-in Status Overview). If you skip this, Rock re-registers nothing once the DLL is gone, but the dead rows linger.
4. **Remove the files.**
   - `RockWeb/Bin/com.yesuchum.CheckInInsights.dll` (and `.pdb`)
   - `RockWeb/Plugins/com_yesuchum/CheckInInsights/` (the whole folder)
5. **Restart the Rock application.**

---

## Post-uninstall housekeeping

Optional, for a truly clean database:

### The digest job's memory

The job stores its last-seen findings in Rock system settings. Remove it:

```sql
DELETE av FROM [AttributeValue] av
JOIN [Attribute] a ON a.Id = av.AttributeId
WHERE a.[Key] = 'com.yesuchum.CheckInInsights.StatusDigestSeenIssues';

DELETE FROM [Attribute]
WHERE [Key] = 'com.yesuchum.CheckInInsights.StatusDigestSeenIssues';
```

### Person preferences

Staff who used the tools have per-block filter preferences stored against the (now deleted) blocks. Rock cleans orphaned person preferences up on its own schedule; no action needed.

### Migration history

The plugin's row in `PluginMigration` (`com.yesuchum.CheckInInsights` migrations) is inert once the DLL is gone. Leave it; it only matters if you reinstall (see below).

---

## Verification checklist

- [ ] **Admin Tools > Installed Plugins** no longer shows Check-in Insights.
- [ ] The block-type picker has no **Yesu Chum > Check-in Insights** category.
- [ ] **Admin Tools > Jobs** has no Status Digest job.
- [ ] No broken-block placeholders on pages where instances had been placed (re-run the SQL from *Before you uninstall*; it should return zero rows).
- [ ] `RockWeb/Bin` has no `com.yesuchum.CheckInInsights.dll`.
- [ ] The Rock exception log shows no `com.yesuchum.CheckInInsights` entries after a restart and a few page loads.

---

## Reinstalling later

Copy the DLL and the Obsidian bundles back and restart. One caveat: if you left the `PluginMigration` history row in place, the migration will NOT re-run (Rock considers it already applied), so the pages and job won't be recreated. Either delete the plugin's rows from `PluginMigration` before the restart, or recreate the pages and job by hand. Block types re-register automatically either way.
