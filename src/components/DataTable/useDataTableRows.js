import { useMemo } from "react";
import { isSameWeek } from "date-fns";

function byId(list) {
  const map = new Map();
  for (const item of list) {
    map.set(item.id, item);
  }
  return map;
}

export default function useDataTableRows(weeks, plannedWeeks) {
  return useMemo(() => {
    const plannedById = byId(plannedWeeks);
    const now = new Date();

    return weeks.map((week) => ({
      week,
      isCurrentWeek: isSameWeek(new Date(week.week_end_date), now, {
        weekStartsOn: 1,
      }),
      isForecast: week.status === "forecast",
      plannedWeek: plannedById.get(week.id) || week,
    }));
  }, [weeks, plannedWeeks]);
}
