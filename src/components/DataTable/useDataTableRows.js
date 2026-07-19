import { useMemo } from "react";
import { isSameWeek } from "date-fns";

function byId(list) {
  const map = new Map();
  for (const item of list) {
    map.set(item.id, item);
  }
  return map;
}

/**
 * Builds the per-row view model the table/card components render from.
 *
 * `plannedWeeks` and `actualWeeks` are converted into id-keyed Maps once
 * (O(n)) instead of being scanned with `.find()` inside every row on every
 * render (O(n) per row, O(n^2) total). The result is memoized on the three
 * source arrays, so re-renders triggered by unrelated state (e.g. `savingId`
 * while a save is in flight) don't rebuild it.
 */
export default function useDataTableRows(weeks, plannedWeeks, actualWeeks) {
  return useMemo(() => {
    const plannedById = byId(plannedWeeks);
    const actualById = byId(actualWeeks);
    const now = new Date();

    return weeks.map((week) => ({
      week,
      isCurrentWeek: isSameWeek(new Date(week.week_end_date), now, {
        weekStartsOn: 1,
      }),
      isForecast: week.status === "forecast",
      plannedWeek: plannedById.get(week.id) || week,
      actualWeek: actualById.get(week.id) || week,
    }));
  }, [weeks, plannedWeeks, actualWeeks]);
}
