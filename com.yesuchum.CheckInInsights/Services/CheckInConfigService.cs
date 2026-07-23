using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

using Rock;
using Rock.Data;
using Rock.Web.Cache;

using com.yesuchum.CheckInInsights.ViewModels;

namespace com.yesuchum.CheckInInsights.Services
{
    /// <summary>
    /// Read-only engine shared by the Check-in Insights blocks. Walks the check-in
    /// configuration tree (template group type &gt; areas &gt; groups &gt; group
    /// locations &gt; schedules) for a campus, expands schedules for a date, and
    /// runs configuration lint rules. Works identically for legacy and Next-Gen
    /// check-in because both engines share the same underlying data model.
    /// </summary>
    public class CheckInConfigService
    {
        private readonly RockContext _rockContext;

        /// <summary>
        /// Creates the service against an existing context. The service never
        /// writes; all queries are no-tracking.
        /// </summary>
        public CheckInConfigService( RockContext rockContext )
        {
            _rockContext = rockContext;
        }

        #region Config tree

        /// <summary>
        /// One check-in area (a descendant group type of a check-in template)
        /// together with the path used to reach it.
        /// </summary>
        private class AreaInfo
        {
            public GroupTypeCache Template { get; set; }

            public GroupTypeCache Area { get; set; }

            public string AreaPath { get; set; }
        }

        /// <summary>
        /// Enumerates every check-in area under every check-in template group type.
        /// The same area can appear under multiple templates; each pairing is
        /// returned so windows and issues are attributed to the right template.
        /// </summary>
        private List<AreaInfo> GetAreas()
        {
            var templatePurposeId = DefinedValueCache.Get( Rock.SystemGuid.DefinedValue.GROUPTYPE_PURPOSE_CHECKIN_TEMPLATE.AsGuid() )?.Id;

            if ( !templatePurposeId.HasValue )
            {
                return new List<AreaInfo>();
            }

            var templates = GroupTypeCache.All()
                .Where( gt => gt.GroupTypePurposeValueId == templatePurposeId.Value )
                .ToList();

            var areas = new List<AreaInfo>();

            foreach ( var template in templates )
            {
                var visited = new HashSet<int> { template.Id };
                CollectAreas( template, template, string.Empty, visited, areas );
            }

            return areas;
        }

        /// <summary>
        /// Depth-first walk of a template's child group types. Check-in trees can
        /// contain cycles (a group type can be its own ancestor via shared areas),
        /// so a visited set guards the recursion.
        /// </summary>
        private void CollectAreas( GroupTypeCache template, GroupTypeCache parent, string parentPath, HashSet<int> visited, List<AreaInfo> areas )
        {
            foreach ( var child in parent.ChildGroupTypes )
            {
                if ( !visited.Add( child.Id ) )
                {
                    continue;
                }

                var path = parentPath.IsNullOrWhiteSpace() ? child.Name : $"{parentPath} > {child.Name}";

                areas.Add( new AreaInfo
                {
                    Template = template,
                    Area = child,
                    AreaPath = path
                } );

                CollectAreas( template, child, path, visited, areas );
            }
        }

        /// <summary>
        /// Determines whether a template looks like a Next-Gen check-in
        /// configuration. HFBC runs legacy and Next-Gen side by side with
        /// "NextGen" in the template/area names, so the name is the reliable
        /// discriminator today.
        /// </summary>
        private static bool IsNextGenTemplate( GroupTypeCache template )
        {
            return template.Name?.IndexOf( "NextGen", StringComparison.OrdinalIgnoreCase ) >= 0;
        }

        /// <summary>
        /// Loads the active groups (with locations, schedules and schedule
        /// configs) for the given areas. Campus scoping happens in memory after
        /// the campus is derived per pairing (group row first, then the
        /// location's ancestor chain), because check-in groups frequently have
        /// no CampusId of their own.
        /// </summary>
        private List<Rock.Model.Group> GetGroups( List<int> areaGroupTypeIds )
        {
            return new Rock.Model.GroupService( _rockContext ).Queryable()
                .AsNoTracking()
                .Where( g => areaGroupTypeIds.Contains( g.GroupTypeId )
                    && g.IsActive )
                .Include( g => g.GroupLocations.Select( gl => gl.Location ) )
                .Include( g => g.GroupLocations.Select( gl => gl.Schedules ) )
                .Include( g => g.GroupLocations.Select( gl => gl.GroupLocationScheduleConfigs ) )
                .ToList();
        }

        private Dictionary<int, int?> _namedLocationParents;
        private Dictionary<int, string> _campusNameByLocationId;

        /// <summary>
        /// Resolves a campus name for a group + location pairing. Check-in groups
        /// frequently have no CampusId of their own, so when the group row gives
        /// nothing the location's ancestor chain is walked up to the campus root
        /// location instead.
        /// </summary>
        private string GetCampusName( Rock.Model.Group group, Rock.Model.GroupLocation groupLocation )
        {
            if ( group.CampusId.HasValue )
            {
                return CampusCache.Get( group.CampusId.Value )?.Name;
            }

            if ( groupLocation == null )
            {
                return null;
            }

            if ( _campusNameByLocationId == null )
            {
                _campusNameByLocationId = CampusCache.All()
                    .Where( c => c.LocationId.HasValue )
                    .GroupBy( c => c.LocationId.Value )
                    .ToDictionary( g => g.Key, g => g.First().Name );

                // Named locations only: rooms/areas/campus roots are named, while
                // address locations are not, which keeps this map small.
                _namedLocationParents = new Rock.Model.LocationService( _rockContext ).Queryable()
                    .AsNoTracking()
                    .Where( l => l.Name != null && l.Name != string.Empty )
                    .Select( l => new { l.Id, l.ParentLocationId } )
                    .ToDictionary( l => l.Id, l => l.ParentLocationId );
            }

            // Walk up the ancestor chain (bounded, in case of data cycles).
            int? currentId = groupLocation.LocationId;

            for ( int depth = 0; depth < 20 && currentId.HasValue; depth++ )
            {
                if ( _campusNameByLocationId.TryGetValue( currentId.Value, out var campusName ) )
                {
                    return campusName;
                }

                if ( !_namedLocationParents.TryGetValue( currentId.Value, out var parentId ) )
                {
                    return null;
                }

                currentId = parentId;
            }

            return null;
        }

        /// <summary>
        /// Determines whether a derived campus name falls inside an optional
        /// campus scope. Pairings whose campus cannot be determined are always
        /// included so misconfigured data stays visible.
        /// </summary>
        private static bool IsInCampusScope( string scopeCampusName, string campusName )
        {
            return scopeCampusName == null || campusName == null || campusName == scopeCampusName;
        }

        #endregion

        #region Concurrency

        /// <summary>
        /// Builds every schedule window active for the campus on the date, with
        /// double-booking flags for windows that overlap at the same location.
        /// Schedule labels are always computed from iCal content because most
        /// check-in schedules have a null Name.
        /// </summary>
        public ConcurrencyResultBag BuildConcurrency( int? campusId, DateTime date )
        {
            var areas = GetAreas();
            var areaIds = areas.Select( a => a.Area.Id ).Distinct().ToList();
            var areasByGroupTypeId = areas
                .GroupBy( a => a.Area.Id )
                .ToDictionary( g => g.Key, g => g.ToList() );

            var groups = GetGroups( areaIds );
            var scopeCampusName = campusId.HasValue ? CampusCache.Get( campusId.Value )?.Name : null;

            var windows = new List<ScheduleWindowBag>();

            // Track (locationId, start, end) tuples so overlaps at the same
            // location can be flagged after all windows are collected.
            var windowRanges = new List<(int LocationId, DateTime Start, DateTime End, ScheduleWindowBag Bag)>();

            // Raw ids per bag so attendance counts can be joined after the walk.
            var windowMeta = new List<(ScheduleWindowBag Bag, int GroupId, int LocationId, int ScheduleId)>();

            foreach ( var group in groups )
            {
                if ( !areasByGroupTypeId.TryGetValue( group.GroupTypeId, out var groupAreas ) )
                {
                    continue;
                }

                foreach ( var groupLocation in group.GroupLocations )
                {
                    var campusName = GetCampusName( group, groupLocation );

                    if ( !IsInCampusScope( scopeCampusName, campusName ) )
                    {
                        continue;
                    }

                    foreach ( var schedule in groupLocation.Schedules )
                    {
                        var checkInTimes = schedule.GetCheckInTimes( date.Date );

                        if ( checkInTimes == null || !checkInTimes.Any() )
                        {
                            continue;
                        }

                        var scheduleConfig = groupLocation.GroupLocationScheduleConfigs
                            .FirstOrDefault( c => c.ScheduleId == schedule.Id );

                        foreach ( var times in checkInTimes )
                        {
                            // A group can sit under multiple templates (legacy +
                            // NextGen share areas in rare cases); emit one window
                            // per template pairing so both views stay truthful.
                            foreach ( var area in groupAreas )
                            {
                                var bag = new ScheduleWindowBag
                                {
                                    CampusName = campusName,
                                    TemplateName = area.Template.Name,
                                    AreaPath = area.AreaPath,
                                    GroupIdKey = group.IdKey,
                                    GroupName = group.Name,
                                    LocationIdKey = groupLocation.Location?.IdKey,
                                    LocationName = groupLocation.Location?.Name,
                                    ScheduleIdKey = schedule.IdKey,
                                    ScheduleLabel = GetScheduleLabel( schedule ),
                                    Start = times.Start.ToString( "s" ),
                                    End = times.End.ToString( "s" ),
                                    CheckInStart = times.CheckInStart.ToString( "s" ),
                                    CheckInEnd = times.CheckInEnd.ToString( "s" ),
                                    IsNextGen = IsNextGenTemplate( area.Template ),
                                    Capacity = scheduleConfig?.MaximumCapacity ?? scheduleConfig?.DesiredCapacity,
                                    FirmRoomThreshold = groupLocation.Location?.FirmRoomThreshold,
                                    SoftRoomThreshold = groupLocation.Location?.SoftRoomThreshold
                                };

                                windows.Add( bag );
                                windowMeta.Add( (bag, group.Id, groupLocation.LocationId, schedule.Id) );

                                if ( groupLocation.LocationId > 0 )
                                {
                                    // Event times, not check-in windows: check-in
                                    // windows overlap by design between services
                                    // (early check-in), so they over-flag.
                                    windowRanges.Add( (groupLocation.LocationId, times.Start, times.End, bag) );
                                }
                            }
                        }
                    }
                }
            }

            FlagDoubleBookings( windowRanges );
            ApplyAttendanceCounts( windowMeta, date );

            return new ConcurrencyResultBag
            {
                Date = date.ToString( "s" ),
                Windows = windows
                    .OrderBy( w => w.AreaPath )
                    .ThenBy( w => w.LocationName )
                    .ThenBy( w => w.CheckInStart )
                    .ToList()
            };
        }

        /// <summary>
        /// Joins actual check-in counts (Attendance rows with DidAttend) onto the
        /// windows for the date, keyed by group + location + schedule. Windows
        /// with no attendance occurrence keep a null count so the client can
        /// distinguish "0 checked in" from "no occurrence yet".
        /// </summary>
        private void ApplyAttendanceCounts( List<(ScheduleWindowBag Bag, int GroupId, int LocationId, int ScheduleId)> windowMeta, DateTime date )
        {
            if ( !windowMeta.Any() )
            {
                return;
            }

            var occurrenceDate = date.Date;
            var groupIds = windowMeta.Select( m => m.GroupId ).Distinct().ToList();

            var counts = new Rock.Model.AttendanceOccurrenceService( _rockContext ).Queryable()
                .AsNoTracking()
                .Where( o => o.OccurrenceDate == occurrenceDate
                    && o.GroupId.HasValue && groupIds.Contains( o.GroupId.Value )
                    && o.LocationId.HasValue
                    && o.ScheduleId.HasValue )
                .Select( o => new
                {
                    GroupId = o.GroupId.Value,
                    LocationId = o.LocationId.Value,
                    ScheduleId = o.ScheduleId.Value,
                    Count = o.Attendees.Count( a => a.DidAttend == true )
                } )
                .ToList()
                .GroupBy( o => (o.GroupId, o.LocationId, o.ScheduleId) )
                .ToDictionary( g => g.Key, g => g.Sum( o => o.Count ) );

            foreach ( var meta in windowMeta )
            {
                if ( counts.TryGetValue( (meta.GroupId, meta.LocationId, meta.ScheduleId), out var count ) )
                {
                    meta.Bag.AttendanceCount = count;
                }
            }
        }

        /// <summary>
        /// Marks windows as possibly double-booked. Deliberately narrow so the
        /// flag stays actionable instead of noise:
        /// same location + same template + DIFFERENT group + DIFFERENT schedule
        /// + overlapping EVENT times. Everything else is normal church operation:
        /// one schedule serving two groups is a combined class, cross-template
        /// overlap is expected co-location (serving team + kids share a room),
        /// and overlapping check-in windows between services are by design.
        /// </summary>
        private static void FlagDoubleBookings( List<(int LocationId, DateTime Start, DateTime End, ScheduleWindowBag Bag)> ranges )
        {
            foreach ( var locationGroup in ranges.GroupBy( r => r.LocationId ) )
            {
                var items = locationGroup.ToList();

                for ( int i = 0; i < items.Count; i++ )
                {
                    for ( int j = i + 1; j < items.Count; j++ )
                    {
                        var a = items[i];
                        var b = items[j];

                        var isSameTemplate = a.Bag.TemplateName == b.Bag.TemplateName;
                        var isDifferentGroup = a.Bag.GroupIdKey != b.Bag.GroupIdKey;
                        var isDifferentSchedule = a.Bag.ScheduleIdKey != b.Bag.ScheduleIdKey;
                        var eventsOverlap = a.Start < b.End && b.Start < a.End;

                        if ( isSameTemplate && isDifferentGroup && isDifferentSchedule && eventsOverlap )
                        {
                            a.Bag.IsDoubleBooked = true;
                            b.Bag.IsDoubleBooked = true;
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Computes a display label for a schedule. Most check-in schedules are
        /// inline iCal schedules with a null Name, so the friendly text derived
        /// from iCalendarContent is the primary source.
        /// </summary>
        public static string GetScheduleLabel( Rock.Model.Schedule schedule )
        {
            if ( schedule.Name.IsNotNullOrWhiteSpace() )
            {
                return schedule.Name;
            }

            var friendlyText = schedule.ToFriendlyScheduleText( true );

            return friendlyText.IsNotNullOrWhiteSpace() ? friendlyText : "Custom Schedule";
        }

        #endregion

        #region Cross-reference

        /// <summary>
        /// Builds the full group / location / schedule cross-reference for a
        /// campus. Every pairing becomes a row; incomplete pairings (group with
        /// no location, location with no schedule) are emitted with null members
        /// so the gaps show up when filtering in either direction.
        /// </summary>
        public XrefResultBag BuildAssignments( int? campusId )
        {
            var areas = GetAreas();
            var areaIds = areas.Select( a => a.Area.Id ).Distinct().ToList();
            var areasByGroupTypeId = areas
                .GroupBy( a => a.Area.Id )
                .ToDictionary( g => g.Key, g => g.ToList() );

            var groups = GetGroups( areaIds );
            var scopeCampusName = campusId.HasValue ? CampusCache.Get( campusId.Value )?.Name : null;

            var assignments = new List<ScheduleAssignmentBag>();

            foreach ( var group in groups )
            {
                if ( !areasByGroupTypeId.TryGetValue( group.GroupTypeId, out var groupAreas ) )
                {
                    continue;
                }

                foreach ( var area in groupAreas )
                {
                    if ( !group.GroupLocations.Any() )
                    {
                        assignments.Add( NewAssignment( area, group, null, null, null ) );
                        continue;
                    }

                    foreach ( var groupLocation in group.GroupLocations )
                    {
                        if ( !groupLocation.Schedules.Any() )
                        {
                            assignments.Add( NewAssignment( area, group, groupLocation, null, null ) );
                            continue;
                        }

                        foreach ( var schedule in groupLocation.Schedules )
                        {
                            var scheduleConfig = groupLocation.GroupLocationScheduleConfigs
                                .FirstOrDefault( c => c.ScheduleId == schedule.Id );

                            assignments.Add( NewAssignment( area, group, groupLocation, schedule, scheduleConfig ) );
                        }
                    }
                }
            }

            return new XrefResultBag
            {
                Assignments = assignments
                    .Where( a => IsInCampusScope( scopeCampusName, a.CampusName ) )
                    .OrderBy( a => a.AreaPath )
                    .ThenBy( a => a.GroupName )
                    .ThenBy( a => a.LocationName )
                    .ThenBy( a => a.ScheduleLabel )
                    .ToList()
            };
        }

        /// <summary>
        /// Creates one cross-reference row. Location, schedule and config are
        /// optional so incomplete pairings can be represented.
        /// </summary>
        private ScheduleAssignmentBag NewAssignment( AreaInfo area, Rock.Model.Group group, Rock.Model.GroupLocation groupLocation, Rock.Model.Schedule schedule, Rock.Model.GroupLocationScheduleConfig scheduleConfig )
        {
            return new ScheduleAssignmentBag
            {
                CampusName = GetCampusName( group, groupLocation ),
                TemplateName = area.Template.Name,
                AreaPath = area.AreaPath,
                GroupIdKey = group.IdKey,
                GroupName = group.Name,
                LocationIdKey = groupLocation?.Location?.IdKey,
                LocationName = groupLocation?.Location?.Name,
                ScheduleIdKey = schedule?.IdKey,
                ScheduleLabel = schedule != null ? GetScheduleLabel( schedule ) : null,
                IsNextGen = IsNextGenTemplate( area.Template ),
                Capacity = scheduleConfig?.MaximumCapacity ?? scheduleConfig?.DesiredCapacity,
                RoomCapacity = groupLocation?.Location?.FirmRoomThreshold ?? groupLocation?.Location?.SoftRoomThreshold
            };
        }

        #endregion

        #region Lint

        /// <summary>
        /// Runs the configuration lint rules for a campus and returns the issues
        /// ordered by severity.
        /// </summary>
        public LintResultBag BuildLintIssues( int? campusId )
        {
            var areas = GetAreas();
            var areaIds = areas.Select( a => a.Area.Id ).Distinct().ToList();
            var areasByGroupTypeId = areas
                .GroupBy( a => a.Area.Id )
                .ToDictionary( g => g.Key, g => g.First() );

            var groups = GetGroups( areaIds );
            var scopeCampusName = campusId.HasValue ? CampusCache.Get( campusId.Value )?.Name : null;
            var groupsByGroupTypeId = groups.ToLookup( g => g.GroupTypeId );

            var issues = new List<LintIssueBag>();

            // Rule: area with no active groups. Only flag leaf areas; parent
            // areas legitimately hold no groups of their own.
            foreach ( var area in areas )
            {
                var isLeafArea = !area.Area.ChildGroupTypes.Any();

                if ( isLeafArea && !groupsByGroupTypeId[area.Area.Id].Any() )
                {
                    issues.Add( NewIssue( "Warning", "Area has no active groups", area,
                        "This check-in area has no active groups, so nothing can check in to it.",
                        null, null, null, null ) );
                }
            }

            foreach ( var group in groups )
            {
                if ( !areasByGroupTypeId.TryGetValue( group.GroupTypeId, out var area ) )
                {
                    continue;
                }

                // Rule: group with no location.
                if ( !group.GroupLocations.Any() )
                {
                    issues.Add( NewIssue( "Error", "Group has no location", area,
                        "The group has no location, so it will never appear as a check-in option.",
                        GetCampusName( group, null ), group, null, null ) );
                    continue;
                }

                foreach ( var groupLocation in group.GroupLocations )
                {
                    var location = groupLocation.Location;
                    var campusName = GetCampusName( group, groupLocation );

                    // Rule: group location with no schedule.
                    if ( !groupLocation.Schedules.Any() )
                    {
                        issues.Add( NewIssue( "Error", "Location has no schedule", area,
                            "The location is attached to the group but has no schedules, so it is never open for check-in.",
                            campusName, group, location, null ) );
                    }

                    if ( location == null )
                    {
                        continue;
                    }

                    // Rule: no printer on the location.
                    if ( !location.PrinterDeviceId.HasValue )
                    {
                        issues.Add( NewIssue( "Info", "Location has no printer", area,
                            "No printer device is set on the location. Labels will only print if a kiosk or ancestor location provides one.",
                            campusName, group, location, null ) );
                    }

                    // Rule: no room thresholds.
                    if ( !location.FirmRoomThreshold.HasValue && !location.SoftRoomThreshold.HasValue )
                    {
                        issues.Add( NewIssue( "Warning", "Location has no room thresholds", area,
                            "Neither a soft nor firm room threshold is set, so check-in will never close the room when it fills.",
                            campusName, group, location, null ) );
                    }

                    // Rule: schedule attached but no capacity configured for it.
                    foreach ( var schedule in groupLocation.Schedules )
                    {
                        var config = groupLocation.GroupLocationScheduleConfigs
                            .FirstOrDefault( c => c.ScheduleId == schedule.Id );

                        var hasCapacity = config != null
                            && ( config.MinimumCapacity.HasValue || config.DesiredCapacity.HasValue || config.MaximumCapacity.HasValue );

                        if ( !hasCapacity )
                        {
                            issues.Add( NewIssue( "Info", "Schedule has no capacity settings", area,
                                "No minimum, desired or maximum capacity is configured for this schedule at this location.",
                                campusName, group, location, schedule ) );
                        }
                    }
                }
            }

            var severityRank = new Dictionary<string, int> { { "Error", 0 }, { "Warning", 1 }, { "Info", 2 } };

            return new LintResultBag
            {
                Issues = issues
                    .Where( i => IsInCampusScope( scopeCampusName, i.CampusName ) )
                    .OrderBy( i => severityRank.TryGetValue( i.Severity, out var rank ) ? rank : 3 )
                    .ThenBy( i => i.AreaPath )
                    .ThenBy( i => i.GroupName )
                    .ThenBy( i => i.LocationName )
                    .ToList()
            };
        }

        /// <summary>
        /// Creates a lint issue attributed to an area's template and path. Group,
        /// location and schedule are optional; each fills the corresponding
        /// display and IdKey members when present.
        /// </summary>
        private static LintIssueBag NewIssue( string severity, string rule, AreaInfo area, string detail, string campusName, Rock.Model.Group group, Rock.Model.Location location, Rock.Model.Schedule schedule )
        {
            return new LintIssueBag
            {
                Severity = severity,
                CampusName = campusName,
                Rule = rule,
                TemplateName = area.Template.Name,
                AreaPath = area.AreaPath,
                GroupName = group?.Name,
                GroupIdKey = group?.IdKey,
                LocationName = location?.Name,
                LocationIdKey = location?.IdKey,
                ScheduleLabel = schedule != null ? GetScheduleLabel( schedule ) : null,
                ScheduleIdKey = schedule?.IdKey,
                Detail = detail
            };
        }

        #endregion
    }
}
