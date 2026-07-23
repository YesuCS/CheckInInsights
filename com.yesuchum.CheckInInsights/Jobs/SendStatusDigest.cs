using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;

using Rock;
using Rock.Attribute;
using Rock.Communication;
using Rock.Data;
using Rock.Jobs;

using com.yesuchum.CheckInInsights.Services;
using com.yesuchum.CheckInInsights.ViewModels;

namespace com.yesuchum.CheckInInsights.Jobs
{
    /// <summary>
    /// Runs the check-in status scan across all campuses and emails a digest
    /// when NEW issues have appeared since the last run. Previously-seen issue
    /// keys are remembered in a Rock system setting, so an unchanged (even
    /// unhealthy) configuration stays silent and only drift gets reported.
    /// </summary>
    [DisplayName( "Check-in Insights: Status Digest" )]
    [Description( "Keeps an eye on your check-in setup so you don't have to. Each run re-checks every campus using the same rules as the Check-in Status Overview page (missing rooms, schedules, printers, thresholds, capacities) and compares the results to the previous run. If something NEW is broken since last time, it emails the addresses configured below. If nothing new is wrong, it stays quiet — no email. It never changes any data." )]

    [TextField( "Recipient Emails",
        Description = "Who should get the alert email. Separate multiple addresses with commas. Leave blank and the job runs silently without sending anything.",
        IsRequired = false,
        Order = 0,
        Key = AttributeKey.RecipientEmails )]

    [BooleanField( "Include Warnings",
        Description = "Normally only new Errors (things that stop check-in from working) trigger an email. Turn this on to also be emailed about new Warnings (things that work but are risky, like a room with no thresholds).",
        DefaultBooleanValue = false,
        Order = 1,
        Key = AttributeKey.IncludeWarnings )]

    public class SendStatusDigest : RockJob
    {
        private static class AttributeKey
        {
            public const string RecipientEmails = "RecipientEmails";
            public const string IncludeWarnings = "IncludeWarnings";
        }

        /// <summary>
        /// System setting key holding the JSON array of issue keys seen on the
        /// previous run.
        /// </summary>
        private static readonly string SeenIssuesSettingKey = "com.yesuchum.CheckInInsights.StatusDigestSeenIssues";

        /// <inheritdoc/>
        public override void Execute()
        {
            var includeWarnings = GetAttributeValue( AttributeKey.IncludeWarnings ).AsBoolean();

            List<LintIssueBag> issues;

            using ( var rockContext = new RockContext() )
            {
                var service = new CheckInConfigService( rockContext );
                issues = service.BuildLintIssues( null ).Issues
                    .Where( i => i.Severity == "Error" || ( includeWarnings && i.Severity == "Warning" ) )
                    .ToList();
            }

            var currentKeys = issues.Select( GetIssueKey ).ToList();
            var previousKeys = new HashSet<string>(
                ( Rock.Web.SystemSettings.GetValue( SeenIssuesSettingKey ) ?? string.Empty )
                    .FromJsonOrNull<List<string>>() ?? new List<string>() );

            var newIssues = issues.Where( i => !previousKeys.Contains( GetIssueKey( i ) ) ).ToList();

            // Always record the current state so resolved issues that reappear
            // later are treated as new again.
            Rock.Web.SystemSettings.SetValue( SeenIssuesSettingKey, currentKeys.ToJson() );

            if ( !newIssues.Any() )
            {
                this.Result = $"No new issues ({issues.Count} known issues unchanged). No email sent.";
                return;
            }

            var recipients = ( GetAttributeValue( AttributeKey.RecipientEmails ) ?? string.Empty )
                .Split( ',' )
                .Select( e => e.Trim() )
                .Where( e => e.IsNotNullOrWhiteSpace() )
                .ToList();

            if ( !recipients.Any() )
            {
                this.Result = $"{newIssues.Count} new issues found but no recipient emails are configured; nothing sent.";
                return;
            }

            var message = new RockEmailMessage
            {
                Subject = $"Check-in Insights: {newIssues.Count} new setup issue{( newIssues.Count == 1 ? string.Empty : "s" )} found",
                Message = BuildDigestHtml( newIssues )
            };

            foreach ( var email in recipients )
            {
                message.AddRecipient( RockEmailMessageRecipient.CreateAnonymous( email, null ) );
            }

            message.Send();

            this.Result = $"Sent digest of {newIssues.Count} new issues to {recipients.Count} recipient(s).";
        }

        /// <summary>
        /// A stable identity for an issue across runs, so only genuinely new
        /// problems trigger a digest.
        /// </summary>
        private static string GetIssueKey( LintIssueBag issue )
        {
            return $"{issue.Severity}|{issue.Rule}|{issue.TemplateName}|{issue.AreaPath}|{issue.GroupName}|{issue.LocationName}|{issue.ScheduleLabel}";
        }

        /// <summary>
        /// Renders the new issues as a simple HTML table for the digest email.
        /// </summary>
        private static string BuildDigestHtml( List<LintIssueBag> newIssues )
        {
            var html = new StringBuilder();

            html.Append( "<p>The following check-in setup issues appeared since the last scan:</p>" );
            html.Append( "<table cellpadding=\"6\" cellspacing=\"0\" border=\"1\" style=\"border-collapse:collapse;border-color:#ddd;\">" );
            html.Append( "<tr><th>Severity</th><th>Campus</th><th>Issue</th><th>Where</th><th>Detail</th></tr>" );

            foreach ( var issue in newIssues )
            {
                html.Append( "<tr>" );
                html.Append( $"<td>{issue.Severity}</td>" );
                html.Append( $"<td>{issue.CampusName ?? "—"}</td>" );
                html.Append( $"<td>{issue.Rule}</td>" );
                var where = string.Join( " / ", new[] { issue.AreaPath, issue.GroupName, issue.LocationName, issue.ScheduleLabel }.Where( part => part.IsNotNullOrWhiteSpace() ) );
                html.Append( $"<td>{where}</td>" );
                html.Append( $"<td>{issue.Detail}</td>" );
                html.Append( "</tr>" );
            }

            html.Append( "</table>" );
            html.Append( "<p>Open the Check-in Status Overview page under Admin Tools &gt; Installed Plugins &gt; Check-in Insights to review and fix.</p>" );

            return html.ToString();
        }
    }
}
