const BASE_INPUT_CLASSES =
  "rounded border border-indigo-500 bg-slate-900 text-center tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400";

export default function EditableEligibleCell({
  week,
  isForecast,
  planningMode,
  plannedWeek,
  actualWeek,
  onPlanChange,
  widthClassName = "w-20",
  paddingClassName = "py-1.5",
}) {
  if (planningMode && isForecast) {
    return (
      <input
        type="number"
        min={0}
        value={plannedWeek.eligible_days}
        onChange={(e) => onPlanChange(week.id, "eligible_days", e.target.value)}
        aria-label={`Planned eligible days for week ending ${week.week_end_date}`}
        className={`${BASE_INPUT_CLASSES} ${widthClassName} ${paddingClassName}`}
      />
    );
  }

  return <span className="tabular-nums">{actualWeek.eligible_days}</span>;
}
