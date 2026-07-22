import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export default function calculateEligibleDays(
  weekEndingDate,
  calendarEvents = [],
) {
  const weekEnd = new Date(weekEndingDate);

  const weekStart = startOfWeek(weekEnd, {
    weekStartsOn: 1, // Monday
  });

  const weekFinish = endOfWeek(weekEnd, {
    weekStartsOn: 1,
  });

  const excludedDays = calendarEvents.filter((event) => {
    const [y, m, d] = event.event_date.split("-").map(Number);

    const date = new Date(y, m - 1, d);

    return isWithinInterval(date, {
      start: weekStart,
      end: weekFinish,
    });
  }).length;

  console.log(excludedDays);

  return Math.max(0, 5 - excludedDays);
}
