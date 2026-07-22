import { addWeeks } from "date-fns";
import formatLocalDate from "../../utils/dateUtils/formatLocalDate";
import calculateEligibleDays from "../../utils/dateUtils/calculateEligibleDays";

export default function generateFutureWeeks(weeks, calendarEvents) {
  if (!weeks.length) return weeks;

  const result = [...weeks];

  let lastWeek = new Date(weeks[weeks.length - 1].week_end_date);
  const year = lastWeek.getFullYear();

  while (true) {
    lastWeek = addWeeks(lastWeek, 1);

    if (lastWeek.getFullYear() !== year) {
      break;
    }

    result.push({
      id: `future-${formatLocalDate(lastWeek)}`,
      week_end_date: formatLocalDate(lastWeek),
      present_days: null,
      eligible_days: calculateEligibleDays(
        formatLocalDate(lastWeek),
        calendarEvents,
      ),
    });
  }

  return result;
}
