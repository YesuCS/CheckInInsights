namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// One schedule occurrence window for a group + location on the requested
    /// date, as computed from the schedule's iCal content. All date values are
    /// ISO 8601 strings; entity references are IdKeys, never raw Ids.
    /// </summary>
    public class ScheduleWindowBag
    {
        /// <summary>The campus name derived from the group or its location, or null when unknown.</summary>
        public string CampusName { get; set; }

        /// <summary>The check-in template (configuration) group type name.</summary>
        public string TemplateName { get; set; }

        /// <summary>The area path from template to the group's area (e.g. "Kids &gt; Preschool").</summary>
        public string AreaPath { get; set; }

        /// <summary>The IdKey of the group.</summary>
        public string GroupIdKey { get; set; }

        /// <summary>The group name.</summary>
        public string GroupName { get; set; }

        /// <summary>A link to the group's admin detail page, when the block has one configured.</summary>
        public string GroupUrl { get; set; }

        /// <summary>The IdKey of the location.</summary>
        public string LocationIdKey { get; set; }

        /// <summary>The location name.</summary>
        public string LocationName { get; set; }

        /// <summary>A link to the location's admin page, when the block has one configured.</summary>
        public string LocationUrl { get; set; }

        /// <summary>The IdKey of the schedule.</summary>
        public string ScheduleIdKey { get; set; }

        /// <summary>A link to the schedule's admin page, when the block has one configured.</summary>
        public string ScheduleUrl { get; set; }

        /// <summary>How many people have checked in (DidAttend) for this group + location + schedule on the date, or null when no occurrence exists.</summary>
        public int? AttendanceCount { get; set; }

        /// <summary>A friendly label computed from the schedule's iCal content. Schedule.Name is usually null; never shown.</summary>
        public string ScheduleLabel { get; set; }

        /// <summary>The occurrence start in ISO 8601 format.</summary>
        public string Start { get; set; }

        /// <summary>The occurrence end in ISO 8601 format.</summary>
        public string End { get; set; }

        /// <summary>When check-in opens, in ISO 8601 format.</summary>
        public string CheckInStart { get; set; }

        /// <summary>When check-in closes, in ISO 8601 format.</summary>
        public string CheckInEnd { get; set; }

        /// <summary>True when this window overlaps another window at the same location.</summary>
        public bool IsDoubleBooked { get; set; }

        /// <summary>The maximum (or desired, when maximum is unset) capacity configured for this group-location-schedule.</summary>
        public int? Capacity { get; set; }

        /// <summary>The location's firm room threshold.</summary>
        public int? FirmRoomThreshold { get; set; }

        /// <summary>The location's soft room threshold.</summary>
        public int? SoftRoomThreshold { get; set; }
    }
}
