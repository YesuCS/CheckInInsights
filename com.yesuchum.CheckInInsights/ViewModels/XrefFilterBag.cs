using System;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// Filter sent by the Schedule Cross-Reference block when requesting data.
    /// </summary>
    public class XrefFilterBag
    {
        /// <summary>The campus to scope to. Required.</summary>
        public Guid? CampusGuid { get; set; }
    }
}
