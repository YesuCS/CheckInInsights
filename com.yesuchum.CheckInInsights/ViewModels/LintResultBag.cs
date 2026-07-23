using System.Collections.Generic;

namespace com.yesuchum.CheckInInsights.ViewModels
{
    /// <summary>
    /// The Check-in Config Lint payload.
    /// </summary>
    public class LintResultBag
    {
        /// <summary>The issues found for the campus, ordered by severity.</summary>
        public List<LintIssueBag> Issues { get; set; }
    }
}
