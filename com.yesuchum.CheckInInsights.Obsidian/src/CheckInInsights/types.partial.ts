import type { ListItemBag } from "@Obsidian/ViewModels/Utility/listItemBag";

/** Initialization data shared by the Check-in Insights blocks. */
export interface CheckInInsightsInitBag {
    /** The active campuses the user can scope the view to. */
    campuses?: ListItemBag[] | null;

    /** The default date (today) in ISO 8601 format. */
    defaultDate?: string | null;
}

/** One schedule occurrence window for a group + location on the requested date. */
export interface ScheduleWindowBag {
    campusName?: string | null;
    templateName?: string | null;
    groupUrl?: string | null;
    locationUrl?: string | null;
    scheduleUrl?: string | null;
    attendanceCount?: number | null;
    areaPath?: string | null;
    groupIdKey?: string | null;
    groupName?: string | null;
    locationIdKey?: string | null;
    locationName?: string | null;
    scheduleIdKey?: string | null;
    scheduleLabel?: string | null;

    /** Occurrence start / end in ISO 8601 format. */
    start?: string | null;
    end?: string | null;

    /** Check-in open / close in ISO 8601 format. */
    checkInStart?: string | null;
    checkInEnd?: string | null;

    isDoubleBooked: boolean;
    capacity?: number | null;
    firmRoomThreshold?: number | null;
    softRoomThreshold?: number | null;
}

/** The Schedule Concurrency Map payload. */
export interface ConcurrencyResultBag {
    date?: string | null;
    windows?: ScheduleWindowBag[] | null;
}

/** One group / location / schedule pairing from the check-in configuration tree. */
export interface ScheduleAssignmentBag {
    campusName?: string | null;
    templateName?: string | null;
    areaPath?: string | null;
    groupIdKey?: string | null;
    groupName?: string | null;
    groupUrl?: string | null;
    locationIdKey?: string | null;
    locationName?: string | null;
    locationUrl?: string | null;
    scheduleIdKey?: string | null;
    scheduleLabel?: string | null;
    scheduleUrl?: string | null;
    capacity?: number | null;
    roomCapacity?: number | null;
}

/** The Schedule Cross-Reference payload. */
export interface XrefResultBag {
    assignments?: ScheduleAssignmentBag[] | null;
}

/** A single configuration issue found by the Check-in Status Overview rules. */
export interface LintIssueBag {
    severity?: string | null;
    campusName?: string | null;
    rule?: string | null;
    templateName?: string | null;
    areaPath?: string | null;
    groupName?: string | null;
    groupIdKey?: string | null;
    groupUrl?: string | null;
    locationName?: string | null;
    locationIdKey?: string | null;
    locationUrl?: string | null;
    scheduleLabel?: string | null;
    scheduleIdKey?: string | null;
    scheduleUrl?: string | null;
    detail?: string | null;
}

/** The Check-in Config Lint payload. */
export interface LintResultBag {
    issues?: LintIssueBag[] | null;
}
