import calculateRunningTotals from "./runningTotals";
import projectWeeks from "./projectWeeks";
import recoverTarget from "./recoverTarget";
import buildDashboard from "./buildDashboard";
import generateFutureWeeks from "./generateFutureWeeks";
import calculateEligibleDays from "../../utils/dateUtils/calculateEligibleDays";

export function forecast(rawWeeks, calendarEvents) {
  const weeks = rawWeeks.map((week) => ({
    ...week,
    eligible_days: calculateEligibleDays(week.week_end_date, calendarEvents),
  }));

  console.log(weeks);
  const allWeeks = generateFutureWeeks(rawWeeks, calendarEvents);
  const projected = projectWeeks(allWeeks);
  const totals = calculateRunningTotals(projected);
  const recovered = recoverTarget(totals);

  return buildDashboard(recovered);
}
