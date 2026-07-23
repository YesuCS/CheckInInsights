using System;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// Filter sent by the Check-in Config Lint block when requesting issues.
    /// </summary>
    public class LintFilterBag
    {
        /// <summary>The campus to scope to. Required.</summary>
        public Guid? CampusGuid { get; set; }
    }
}
