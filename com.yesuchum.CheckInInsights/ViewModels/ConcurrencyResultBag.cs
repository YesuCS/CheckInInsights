using System.Collections.Generic;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// The Schedule Concurrency Map payload: every schedule window active on the
    /// requested campus and date.
    /// </summary>
    public class ConcurrencyResultBag
    {
        /// <summary>The date the windows were expanded for, in ISO 8601 format.</summary>
        public string Date { get; set; }

        /// <summary>The schedule windows for the campus and date.</summary>
        public List<ScheduleWindowBag> Windows { get; set; }
    }
}
