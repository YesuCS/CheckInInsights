namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// A single configuration issue found by the Check-in Status Overview rules.
    /// Group, location and schedule are separate members (each nullable) so the
    /// grid can render and link them independently.
    /// </summary>
    public class LintIssueBag
    {
        /// <summary>The issue severity: Error, Warning or Info.</summary>
        public string Severity { get; set; }

        /// <summary>The campus name of the offending group, or null when not campus-specific.</summary>
        public string CampusName { get; set; }

        /// <summary>The short name of the rule that fired.</summary>
        public string Rule { get; set; }

        /// <summary>The check-in template (configuration) group type name.</summary>
        public string TemplateName { get; set; }

        /// <summary>The area path from template to the offending area.</summary>
        public string AreaPath { get; set; }

        /// <summary>The offending group's name, or null for area-level issues.</summary>
        public string GroupName { get; set; }

        /// <summary>The IdKey of the offending group, when the issue is group-derived.</summary>
        public string GroupIdKey { get; set; }

        /// <summary>A link to the group's admin detail page, when the block has one configured.</summary>
        public string GroupUrl { get; set; }

        /// <summary>The offending location's name, when the issue involves a location.</summary>
        public string LocationName { get; set; }

        /// <summary>The IdKey of the offending location, when the issue involves a location.</summary>
        public string LocationIdKey { get; set; }

        /// <summary>A link to the location's admin page, when the block has one configured.</summary>
        public string LocationUrl { get; set; }

        /// <summary>The friendly schedule label, when the issue involves a schedule.</summary>
        public string ScheduleLabel { get; set; }

        /// <summary>The IdKey of the schedule, when the issue involves a schedule.</summary>
        public string ScheduleIdKey { get; set; }

        /// <summary>A link to the schedule's admin page, when the block has one configured.</summary>
        public string ScheduleUrl { get; set; }

        /// <summary>A human-readable explanation of the issue.</summary>
        public string Detail { get; set; }
    }
}
