using System.Collections.Generic;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// The Schedule Cross-Reference payload.
    /// </summary>
    public class XrefResultBag
    {
        /// <summary>Every group/location/schedule assignment for the campus.</summary>
        public List<ScheduleAssignmentBag> Assignments { get; set; }
    }
}
