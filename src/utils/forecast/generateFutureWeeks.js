import { addWeeks } from "date-fns";

export default function generateFutureWeeks(weeks) {
  if (!weeks.length) return weeks;

  const result = [...weeks];

  let lastWeek = new Date(weeks[weeks.length - 1].week_end_date);
  const year = lastWeek.getFullYear();

  while (true) {
    // Move exactly one week forward (Friday → Friday)
    lastWeek = addWeeks(lastWeek, 1);

    if (lastWeek.getFullYear() !== year) {
      break;
    }

    result.push({
      id: `future-${lastWeek.toISOString().split("T")[0]}`,
      week_end_date: lastWeek.toISOString().split("T")[0],
      present_days: null,
      eligible_days: 5,
    });
  }

  return result;
}
