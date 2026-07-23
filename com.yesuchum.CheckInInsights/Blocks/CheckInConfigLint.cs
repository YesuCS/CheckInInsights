using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

using Rock;
using Rock.Attribute;
using Rock.Blocks;
using Rock.Data;
using Rock.ViewModels.Utility;
using Rock.Web.Cache;

using com.yesuchum.CheckInInsights.Services;
using com.yesuchum.CheckInInsights.ViewModels;

namespace com.yesuchum.CheckInInsights.Blocks
{
    /// <summary>
    /// Read-only "linter" over check-in configuration: surfaces missing schedules,
    /// locations, printers, thresholds and capacities as a filterable issue grid.
    /// </summary>
    [DisplayName( "Check-in Status Overview" )]
    [Category( "Yesu Chum > Check-in Insights" )]
    [Description( "Scans check-in configuration and lists setup problems: groups without schedules or locations, missing printers, missing thresholds and capacities, and empty areas." )]
    [IconCssClass( "ti ti-list-check" )]
    [SupportedSiteTypes( Rock.Model.SiteType.Web )]

    [LinkedPage( "Group Detail Page",
        Description = "The page each issue's group links to for making fixes. Defaults to the core Group Viewer.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.GROUP_VIEWER,
        Order = 0,
        Key = AttributeKey.GroupDetailPage )]

    [LinkedPage( "Location Detail Page",
        Description = "The page each issue's location links to for making fixes. Defaults to the core Named Locations page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.NAMED_LOCATIONS_CHECK_IN,
        Order = 1,
        Key = AttributeKey.LocationDetailPage )]

    [LinkedPage( "Schedule Detail Page",
        Description = "The page each issue's schedule links to for making fixes. Defaults to the core Schedules page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.SCHEDULES_CHECK_IN,
        Order = 2,
        Key = AttributeKey.ScheduleDetailPage )]

    [Rock.SystemGuid.EntityTypeGuid( SystemGuid.EntityType.CHECKIN_CONFIG_LINT )]
    [Rock.SystemGuid.BlockTypeGuid( SystemGuid.BlockType.CHECKIN_CONFIG_LINT )]
    public class CheckInConfigLint : RockBlockType
    {
        private static class AttributeKey
        {
            public const string GroupDetailPage = "GroupDetailPage";
            public const string LocationDetailPage = "LocationDetailPage";
            public const string ScheduleDetailPage = "ScheduleDetailPage";
        }

        private static class PageParameterKey
        {
            public const string GroupId = "GroupId";
            public const string LocationId = "LocationId";
            public const string ScheduleId = "ScheduleId";
        }

        /// <inheritdoc/>
        public override string ObsidianFileUrl => "~/Plugins/com_yesuchum/CheckInInsights/checkInConfigLint.obs";

        /// <inheritdoc/>
        public override object GetObsidianBlockInitialization()
        {
            return new CheckInInsightsInitBag
            {
                Campuses = CampusCache.All()
                    .Where( c => c.IsActive == true )
                    .OrderBy( c => c.Order )
                    .Select( c => new ListItemBag { Value = c.Guid.ToString(), Text = c.Name } )
                    .ToList(),
                DefaultDate = RockDateTime.Today.ToString( "s" )
            };
        }

        /// <summary>
        /// Runs the lint rules for the campus and returns the issue list.
        /// </summary>
        [BlockAction]
        public BlockActionResult GetLintIssues( LintFilterBag filter )
        {
            // A missing campus means all campuses.
            int? campusId = null;

            if ( filter?.CampusGuid != null )
            {
                var campus = CampusCache.Get( filter.CampusGuid.Value );

                if ( campus == null )
                {
                    return ActionNotFound( "Campus not found." );
                }

                campusId = campus.Id;
            }

            using ( var rockContext = new RockContext() )
            {
                var service = new CheckInConfigService( rockContext );
                var result = service.BuildLintIssues( campusId );

                // Attach fix links so each issue can jump straight to the admin
                // page for its group, location or schedule.
                foreach ( var issue in result.Issues )
                {
                    issue.GroupUrl = GetEntityUrl( AttributeKey.GroupDetailPage, PageParameterKey.GroupId, issue.GroupIdKey );
                    issue.LocationUrl = GetEntityUrl( AttributeKey.LocationDetailPage, PageParameterKey.LocationId, issue.LocationIdKey );
                    issue.ScheduleUrl = GetEntityUrl( AttributeKey.ScheduleDetailPage, PageParameterKey.ScheduleId, issue.ScheduleIdKey );
                }

                return ActionOk( result );
            }
        }

        /// <summary>
        /// Builds a configured linked-page URL for an entity IdKey, or null when
        /// no page is configured or the key cannot be resolved.
        /// </summary>
        private string GetEntityUrl( string attributeKey, string pageParameterKey, string idKey )
        {
            if ( idKey.IsNullOrWhiteSpace() )
            {
                return null;
            }

            var entityId = Rock.Utility.IdHasher.Instance.GetId( idKey );

            if ( !entityId.HasValue )
            {
                return null;
            }

            var pageParams = new Dictionary<string, string>();
            pageParams.Add( pageParameterKey, entityId.Value.ToString() );

            var url = this.GetLinkedPageUrl( attributeKey, pageParams );

            return url.IsNullOrWhiteSpace() ? null : url;
        }
    }
}
