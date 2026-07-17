import calculateRunningTotals from "./runningTotals";
import projectWeeks from "./projectWeeks";
import recoverTarget from "./recoverTarget";
import buildDashboard from "./buildDashboard";
import generateFutureWeeks from "./generateFutureWeeks";

export function forecast(rawWeeks) {
  const allWeeks = generateFutureWeeks(rawWeeks);
  const projected = projectWeeks(allWeeks);
  const totals = calculateRunningTotals(projected);
  const recovered = recoverTarget(totals);

  return buildDashboard(recovered);
}
