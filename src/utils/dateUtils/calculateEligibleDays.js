import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export default function calculateEligibleDays(weekEndingDate, calendarEvents) {
  const [y, m, d] = weekEndingDate.split("-").map(Number);

  const weekEnd = new Date(y, m - 1, d);

  const weekStart = startOfWeek(weekEnd, {
    weekStartsOn: 1, // Monday
  });

  const weekFinish = endOfWeek(weekEnd, {
    weekStartsOn: 1,
  });

  // Date-only events may be duplicated by older data. Only unique weekday events
  // can reduce the five-day workweek capacity.
  const excludedDates = new Set(
    calendarEvents
      .filter((event) => {
        const [eventYear, eventMonth, eventDay] = event.event_date
          .split("-")
          .map(Number);
        const date = new Date(eventYear, eventMonth - 1, eventDay);

        return (
          isWithinInterval(date, { start: weekStart, end: weekFinish }) &&
          date.getDay() >= 1 &&
          date.getDay() <= 5
        );
      })
      .map((event) => event.event_date),
  );

  return Math.max(0, 5 - excludedDates.size);
}
