import calculateRunningTotals from "./runningTotals";
import projectWeeks from "./projectWeeks";
import recoverTarget from "./recoverTarget";
import buildDashboard from "./buildDashboard";
import generateFutureWeeks from "./generateFutureWeeks";

export function forecast(rawWeeks, calendarEvents) {
  const allWeeks = generateFutureWeeks(rawWeeks, calendarEvents);
  const projected = projectWeeks(allWeeks);
  const totals = calculateRunningTotals(projected);
  const recovered = recoverTarget(totals);

  return buildDashboard(recovered);
}
