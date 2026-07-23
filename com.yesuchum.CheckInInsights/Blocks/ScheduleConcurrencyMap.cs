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
    /// Read-only visualization of which check-in schedules, groups and locations
    /// are active concurrently for a campus and date, flagging locations that are
    /// double-booked by overlapping schedules.
    /// </summary>
    [DisplayName( "Check-in Timeline" )]
    [Category( "Yesu Chum > Check-in Insights" )]
    [Description( "Shows what check-in schedules/groups/locations are active concurrently for a campus and date, and flags location double-bookings." )]
    [IconCssClass( "ti ti-calendar-time" )]
    [SupportedSiteTypes( Rock.Model.SiteType.Web )]

    [LinkedPage( "Group Detail Page",
        Description = "The page a window's group links to. Defaults to the core Group Viewer.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.GROUP_VIEWER,
        Order = 0,
        Key = AttributeKey.GroupDetailPage )]

    [LinkedPage( "Location Detail Page",
        Description = "The page a window's location links to. Defaults to the core Named Locations page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.NAMED_LOCATIONS_CHECK_IN,
        Order = 1,
        Key = AttributeKey.LocationDetailPage )]

    [LinkedPage( "Schedule Detail Page",
        Description = "The page a window's schedule links to. Defaults to the core Schedules page under Check-in.",
        IsRequired = false,
        DefaultValue = Rock.SystemGuid.Page.SCHEDULES_CHECK_IN,
        Order = 2,
        Key = AttributeKey.ScheduleDetailPage )]

    [Rock.SystemGuid.EntityTypeGuid( SystemGuid.EntityType.SCHEDULE_CONCURRENCY_MAP )]
    [Rock.SystemGuid.BlockTypeGuid( SystemGuid.BlockType.SCHEDULE_CONCURRENCY_MAP )]
    public class ScheduleConcurrencyMap : RockBlockType
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
        public override string ObsidianFileUrl => "~/Plugins/com_yesuchum/CheckInInsights/scheduleConcurrencyMap.obs";

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
        /// Expands every check-in schedule window for the campus and date and
        /// flags double-booked locations.
        /// </summary>
        [BlockAction]
        public BlockActionResult GetConcurrency( ConcurrencyFilterBag filter )
        {
            // A missing campus means all campuses; scoping happens client-side.
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

            var date = filter?.Date.AsDateTime() ?? RockDateTime.Today;

            using ( var rockContext = new RockContext() )
            {
                var service = new CheckInConfigService( rockContext );
                var result = service.BuildConcurrency( campusId, date );

                // Attach links so the window detail popover can jump to the
                // admin page for its group, location or schedule.
                foreach ( var window in result.Windows )
                {
                    window.GroupUrl = GetEntityUrl( AttributeKey.GroupDetailPage, PageParameterKey.GroupId, window.GroupIdKey );
                    window.LocationUrl = GetEntityUrl( AttributeKey.LocationDetailPage, PageParameterKey.LocationId, window.LocationIdKey );
                    window.ScheduleUrl = GetEntityUrl( AttributeKey.ScheduleDetailPage, PageParameterKey.ScheduleId, window.ScheduleIdKey );
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

            var pageParams = new System.Collections.Generic.Dictionary<string, string>();
            pageParams.Add( pageParameterKey, entityId.Value.ToString() );

            var url = this.GetLinkedPageUrl( attributeKey, pageParams );

            return url.IsNullOrWhiteSpace() ? null : url;
        }
    }
}
