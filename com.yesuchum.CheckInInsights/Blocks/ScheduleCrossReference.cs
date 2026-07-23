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
    /// Read-only cross-reference of the check-in configuration tree: every
    /// group / location / schedule pairing as a filterable grid, so staff can
    /// answer "what does this schedule serve?" and "when is this room used?"
    /// in either direction.
    /// </summary>
    [DisplayName( "Rooms & Schedules" )]
    [Category( "Yesu Chum > Check-in Insights" )]
    [Description( "Lists every check-in group / location / schedule pairing for a campus as a filterable grid, including incomplete pairings (missing locations or schedules)." )]
    [IconCssClass( "ti ti-arrows-cross" )]
    [SupportedSiteTypes( Rock.Model.SiteType.Web )]

    [LinkedPage( "Group Detail Page",
        Description = "The page each row's group links to for making fixes. Defaults to the core Group Viewer.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.GROUP_VIEWER,
        Order = 0,
        Key = AttributeKey.GroupDetailPage )]

    [LinkedPage( "Location Detail Page",
        Description = "The page each row's location links to for making fixes. Defaults to the core Named Locations page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.NAMED_LOCATIONS_CHECK_IN,
        Order = 1,
        Key = AttributeKey.LocationDetailPage )]

    [LinkedPage( "Schedule Detail Page",
        Description = "The page each row's schedule links to for making fixes. Defaults to the core Schedules page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.SCHEDULES_CHECK_IN,
        Order = 2,
        Key = AttributeKey.ScheduleDetailPage )]

    [Rock.SystemGuid.EntityTypeGuid( SystemGuid.EntityType.SCHEDULE_CROSS_REFERENCE )]
    [Rock.SystemGuid.BlockTypeGuid( SystemGuid.BlockType.SCHEDULE_CROSS_REFERENCE )]
    public class ScheduleCrossReference : RockBlockType
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
        public override string ObsidianFileUrl => "~/Plugins/com_yesuchum/CheckInInsights/scheduleCrossReference.obs";

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
        /// Builds the group / location / schedule cross-reference for the campus.
        /// </summary>
        [BlockAction]
        public BlockActionResult GetAssignments( XrefFilterBag filter )
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
                var result = service.BuildAssignments( campusId );

                // Attach fix links so each row can jump straight to the admin
                // page for its group, location or schedule. IdKeys are decoded
                // server-side; the client never sees raw ids outside the URLs.
                foreach ( var assignment in result.Assignments )
                {
                    assignment.GroupUrl = GetEntityUrl( AttributeKey.GroupDetailPage, PageParameterKey.GroupId, assignment.GroupIdKey );
                    assignment.LocationUrl = GetEntityUrl( AttributeKey.LocationDetailPage, PageParameterKey.LocationId, assignment.LocationIdKey );
                    assignment.ScheduleUrl = GetEntityUrl( AttributeKey.ScheduleDetailPage, PageParameterKey.ScheduleId, assignment.ScheduleIdKey );
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
