namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// One group + location + schedule assignment row from the check-in
    /// configuration tree. Location and schedule can be null when the pairing is
    /// incomplete (group with no location, location with no schedule) so gaps
    /// stay visible in the cross-reference.
    /// </summary>
    public class ScheduleAssignmentBag
    {
        /// <summary>The campus name of the group, or null when the group has no campus.</summary>
        public string CampusName { get; set; }

        /// <summary>The check-in template (configuration) group type name.</summary>
        public string TemplateName { get; set; }

        /// <summary>The area path from template to the group's area.</summary>
        public string AreaPath { get; set; }

        /// <summary>The IdKey of the group.</summary>
        public string GroupIdKey { get; set; }

        /// <summary>The group name.</summary>
        public string GroupName { get; set; }

        /// <summary>A link to the group's admin detail page, when the block has one configured.</summary>
        public string GroupUrl { get; set; }

        /// <summary>The IdKey of the location, or null when the group has none.</summary>
        public string LocationIdKey { get; set; }

        /// <summary>The location name, or null when the group has none.</summary>
        public string LocationName { get; set; }

        /// <summary>A link to the location's admin page, when the block has one configured.</summary>
        public string LocationUrl { get; set; }

        /// <summary>The IdKey of the schedule, or null when none is attached.</summary>
        public string ScheduleIdKey { get; set; }

        /// <summary>The friendly schedule label, or null when none is attached.</summary>
        public string ScheduleLabel { get; set; }

        /// <summary>A link to the schedule's admin page, when the block has one configured.</summary>
        public string ScheduleUrl { get; set; }

        /// <summary>True when the template appears to be a Next-Gen check-in configuration.</summary>
        public bool IsNextGen { get; set; }

        /// <summary>The maximum (or desired) capacity configured on this specific group + location + schedule pairing, when one is set.</summary>
        public int? Capacity { get; set; }

        /// <summary>The room's own firm (or soft) threshold, used as the fallback capacity when the pairing has none of its own.</summary>
        public int? RoomCapacity { get; set; }
    }
}
