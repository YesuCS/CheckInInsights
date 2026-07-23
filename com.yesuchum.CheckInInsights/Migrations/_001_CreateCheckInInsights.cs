using Rock.Plugin;

using com.yesuchum.CheckInInsights.SystemGuid;

namespace com.yesuchum.CheckInInsights.Migrations
{
    /// <summary>
    /// Creates everything the plugin needs in its final v1.0 shape: the
    /// <em>Admin Tools → Installed Plugins → Check-in Insights</em> page tree
    /// (landing page with a Page Menu plus three tool pages, one block each)
    /// and the Status Digest service job. Block types themselves self-register
    /// at startup via their EntityTypeGuid/BlockTypeGuid attributes.
    /// </summary>
    /// <remarks>
    /// This migration replaces what was originally four migrations
    /// (<c>_001</c>–<c>_004</c>) during pre-v1.0.0 development. The intermediate
    /// migrations did real work in dev (page creation, a landing Page Menu, two
    /// rounds of layman-friendly renames, job registration), but a fresh install
    /// only needs the final shape. All GUIDs match the pre-squash values, so a
    /// dev install that already ran the originals recognizes the same rows.
    /// </remarks>
    [MigrationNumber( 1, "1.16" )]
    public class _001_CreateCheckInInsights : Migration
    {
        // -- Rock-published Guids we depend on.
        private const string InstalledPluginsPage = "5B6DBC42-8B03-4D15-8D92-AAFA28FD8616";
        private const string InternalFullWidthLayout = "D65F783D-87A9-4CC9-8110-E83466A0EADB";
        private const string PageMenuBlockType = "CACB9D1A-A820-4587-986A-D66A69EE9948";
        private const string PageMenuTemplateAttribute = "1322186A-862A-4CF1-B349-28ECB67229BA";

        // -- Stable Guids this migration owns. Permanent once shipped.
        private const string InsightsPage = "C3152A92-9553-4C90-8316-55F2B0CAB12E";
        private const string TimelinePage = "42141E74-E6EA-4C1D-9A01-28A86496DAC1";
        private const string RoomsAndSchedulesPage = "0DB606C0-5CCC-4F98-BD26-39DBC03CEE03";
        private const string StatusOverviewPage = "690DECF7-8D63-4354-96E4-5C2CBED7F15A";
        private const string LandingPageMenuBlock = "7FA7EAA2-F5A5-4247-B892-590542D2EF96";
        private const string TimelineBlock = "BB695DB5-880E-4A8A-825E-9B65FCD9C944";
        private const string RoomsAndSchedulesBlock = "4257056C-281A-4A9E-B18D-78A19E406D9D";
        private const string StatusOverviewBlock = "9523DD96-502A-479C-A879-D4B9B3B9B89B";
        private const string DigestJob = "85F223E8-7C60-4D76-A528-6B923493B1B4";

        /// <inheritdoc/>
        public override void Up()
        {
            // -- Pages --

            RockMigrationHelper.AddPage(
                skipIfAlreadyExists: true,
                parentPageGuid: InstalledPluginsPage,
                layoutGuid: InternalFullWidthLayout,
                name: "Check-in Insights",
                description: "Companion tooling around check-in: schedule timeline, rooms and schedules cross-reference, and setup status overview.",
                guid: InsightsPage,
                iconCssClass: "ti ti-calendar-time" );

            RockMigrationHelper.AddPage(
                skipIfAlreadyExists: true,
                parentPageGuid: InsightsPage,
                layoutGuid: InternalFullWidthLayout,
                name: "Check-in Timeline",
                description: "Timeline of check-in schedules per room and date, with live check-in counts and possible double-booking flags.",
                guid: TimelinePage,
                iconCssClass: "ti ti-calendar-time" );

            RockMigrationHelper.AddPage(
                skipIfAlreadyExists: true,
                parentPageGuid: InsightsPage,
                layoutGuid: InternalFullWidthLayout,
                name: "Rooms & Schedules",
                description: "Which groups and rooms are tied to each schedule, and vice versa.",
                guid: RoomsAndSchedulesPage,
                iconCssClass: "ti ti-arrows-cross" );

            RockMigrationHelper.AddPage(
                skipIfAlreadyExists: true,
                parentPageGuid: InsightsPage,
                layoutGuid: InternalFullWidthLayout,
                name: "Check-in Status Overview",
                description: "Setup problems found across the check-in configuration.",
                guid: StatusOverviewPage,
                iconCssClass: "ti ti-list-check" );

            // -- Blocks --

            RockMigrationHelper.AddBlock(
                skipIfAlreadyExists: true,
                pageGuid: InsightsPage,
                layoutGuid: null,
                blockTypeGuid: PageMenuBlockType,
                name: "Page Menu",
                zone: "Main",
                preHtml: string.Empty,
                postHtml: string.Empty,
                order: 0,
                guid: LandingPageMenuBlock );

            RockMigrationHelper.AddBlockAttributeValue(
                blockGuid: LandingPageMenuBlock,
                attributeGuid: PageMenuTemplateAttribute,
                value: "{% include '~~/Assets/Lava/PageListAsBlocks.lava' %}" );

            RockMigrationHelper.AddBlock(
                skipIfAlreadyExists: true,
                pageGuid: TimelinePage,
                layoutGuid: null,
                blockTypeGuid: BlockType.SCHEDULE_CONCURRENCY_MAP,
                name: "Check-in Timeline",
                zone: "Main",
                preHtml: string.Empty,
                postHtml: string.Empty,
                order: 0,
                guid: TimelineBlock );

            RockMigrationHelper.AddBlock(
                skipIfAlreadyExists: true,
                pageGuid: RoomsAndSchedulesPage,
                layoutGuid: null,
                blockTypeGuid: BlockType.SCHEDULE_CROSS_REFERENCE,
                name: "Rooms & Schedules",
                zone: "Main",
                preHtml: string.Empty,
                postHtml: string.Empty,
                order: 0,
                guid: RoomsAndSchedulesBlock );

            RockMigrationHelper.AddBlock(
                skipIfAlreadyExists: true,
                pageGuid: StatusOverviewPage,
                layoutGuid: null,
                blockTypeGuid: BlockType.CHECKIN_CONFIG_LINT,
                name: "Check-in Status Overview",
                zone: "Main",
                preHtml: string.Empty,
                postHtml: string.Empty,
                order: 0,
                guid: StatusOverviewBlock );

            // -- Status Digest job (inert until recipient emails are configured) --

            Sql( $@"
                IF NOT EXISTS ( SELECT 1 FROM [ServiceJob] WHERE [Guid] = '{DigestJob}' )
                BEGIN
                    INSERT INTO [ServiceJob]
                        ( [IsSystem], [IsActive], [Name], [Description], [Class], [CronExpression], [NotificationStatus], [Guid] )
                    VALUES
                        ( 0, 1,
                          'Check-in Insights: Status Digest',
                          'Keeps an eye on your check-in setup so you don''t have to. Each run re-checks every campus using the same rules as the Check-in Status Overview page and compares the results to the previous run. If something NEW is broken since last time, it emails the configured recipients. If nothing new is wrong, it stays quiet. It never changes any data.',
                          'com.yesuchum.CheckInInsights.Jobs.SendStatusDigest',
                          '0 0 6 1/1 * ? *',
                          1,
                          '{DigestJob}' )
                END" );
        }

        /// <inheritdoc/>
        public override void Down()
        {
            Sql( $"DELETE FROM [ServiceJob] WHERE [Guid] = '{DigestJob}'" );

            RockMigrationHelper.DeleteBlock( StatusOverviewBlock );
            RockMigrationHelper.DeleteBlock( RoomsAndSchedulesBlock );
            RockMigrationHelper.DeleteBlock( TimelineBlock );
            RockMigrationHelper.DeleteBlock( LandingPageMenuBlock );
            RockMigrationHelper.DeletePage( StatusOverviewPage );
            RockMigrationHelper.DeletePage( RoomsAndSchedulesPage );
            RockMigrationHelper.DeletePage( TimelinePage );
            RockMigrationHelper.DeletePage( InsightsPage );
        }
    }
}
