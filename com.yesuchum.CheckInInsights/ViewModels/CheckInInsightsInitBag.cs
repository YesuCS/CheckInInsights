using System.Collections.Generic;

using Rock.ViewModels.Utility;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// Initialization data shared by the Check-in Insights blocks: the campus
    /// list to scope by and the default date to inspect.
    /// </summary>
    public class CheckInInsightsInitBag
    {
        /// <summary>The active campuses the user can scope the view to.</summary>
        public List<ListItemBag> Campuses { get; set; }

        /// <summary>The default date (today) in ISO 8601 format.</summary>
        public string DefaultDate { get; set; }
    }
}
