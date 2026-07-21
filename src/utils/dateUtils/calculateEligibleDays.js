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
    const date = new Date(event.event_date);

    return isWithinInterval(date, {
      start: weekStart,
      end: weekFinish,
    });
  }).length;

  return Math.max(0, 5 - excludedDays);
}
