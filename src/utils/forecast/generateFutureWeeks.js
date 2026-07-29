import { addWeeks } from "date-fns";
import { DEFAULT_OPTIONS } from "./constants";
import formatLocalDate from "../../utils/dateUtils/formatLocalDate";
import calculateEligibleDays from "../../utils/dateUtils/calculateEligibleDays";

export default function generateFutureWeeks(
  weeks,
  calendarEvents,
  options = DEFAULT_OPTIONS,
) {
  if (!weeks.length) return weeks;

  const result = [...weeks];

  let lastWeek = new Date(weeks[weeks.length - 1].week_end_date);
  const year = lastWeek.getFullYear();

  while (true) {
    lastWeek = addWeeks(lastWeek, 1);

    if (lastWeek.getFullYear() !== year) {
      break;
    }

    const eligible_days = calculateEligibleDays(
      formatLocalDate(lastWeek),
      calendarEvents,
    );

    result.push({
      id: `future-${formatLocalDate(lastWeek)}`,
      week_end_date: formatLocalDate(lastWeek),
      present_days: Math.min(options.defaultWeeklyAttendance, eligible_days),
      eligible_days: eligible_days,
    });
  }

  return result;
}
