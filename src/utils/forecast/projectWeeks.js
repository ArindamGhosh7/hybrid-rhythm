// src/utils/forecast/projectWeeks.js

import { DEFAULT_OPTIONS } from "./constants";
import { isAfter, isSameWeek } from "date-fns";

export default function projectWeeks(weeks, options = DEFAULT_OPTIONS) {
  const today = new Date();

  return weeks.map((week) => {
    const weekDate = new Date(week.week_end_date);

    let status;

    if (isSameWeek(weekDate, today, { weekStartsOn: 1 })) {
      status = "current";
    } else if (isAfter(weekDate, today)) {
      status = "forecast";
    } else {
      status = "completed";
    }

    let recommendedPresent;

    if (status === "forecast") {
      const hasPlannedAttendance =
        week.present_days !== null &&
        week.present_days !== undefined &&
        week.present_days !== "";

      recommendedPresent = hasPlannedAttendance
        ? Number(week.present_days)
        : Math.min(options.defaultWeeklyAttendance, week.eligible_days);
    } else {
      recommendedPresent = Number(week.present_days);
    }

    return {
      ...week,
      status,
      recommendedPresent,
      extraDays: 0,
      requiresRecovery: false,
    };
  });
}
