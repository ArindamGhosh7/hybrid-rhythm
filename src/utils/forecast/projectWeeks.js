// src/utils/forecast/projectWeeks.js

import { DEFAULT_OPTIONS } from "./constants";

export default function projectWeeks(weeks, options = DEFAULT_OPTIONS) {
  return weeks.map((week) => {
    const status = week.present_days === null ? "forecast" : "completed";

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
