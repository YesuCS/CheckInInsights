using System;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// Filter sent by the Schedule Concurrency Map block when requesting data.
    /// </summary>
    public class ConcurrencyFilterBag
    {
        /// <summary>The campus to scope to. Required.</summary>
        public Guid? CampusGuid { get; set; }

        /// <summary>The date to expand schedules for, in ISO 8601 format.</summary>
        public string Date { get; set; }
    }
}
