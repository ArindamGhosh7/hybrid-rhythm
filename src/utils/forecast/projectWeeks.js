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

    return {
      ...week,

      status,

      recommendedPresent:
        status === "forecast"
          ? Math.min(options.defaultWeeklyAttendance, week.eligible_days)
          : Number(week.present_days),

      extraDays: 0,

      requiresRecovery: false,
    };
  });
}
