const BASE_INPUT_CLASSES =
  "rounded border bg-slate-900 text-center tabular-nums focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function EditableAttendanceCell({
  week,
  isCurrentWeek,
  isForecast,
  planningMode,
  plannedWeek,
  actualWeek,
  savingId,
  onSave,
  onPlanChange,
  widthClassName = "w-20",
  paddingClassName = "py-1.5",
}) {
  const weekLabel = `week ending ${week.week_end_date}`;

  if (isCurrentWeek) {
    return (
      <input
        type="number"
        min={0}
        max={actualWeek.eligible_days}
        defaultValue={actualWeek.present_days ?? ""}
        disabled={savingId === week.id}
        onBlur={(e) => onSave(week.id, e.target.value)}
        aria-label={`Present days for ${weekLabel}`}
        className={`${BASE_INPUT_CLASSES} ${widthClassName} ${paddingClassName} border-slate-600 focus:ring-emerald-400 focus:border-emerald-400`}
      />
    );
  }

  if (planningMode && isForecast) {
    return (
      <input
        type="number"
        min={0}
        max={plannedWeek.eligible_days}
        value={plannedWeek.present_days ?? ""}
        onChange={(e) => onPlanChange(week.id, "present_days", e.target.value)}
        aria-label={`Planned present days for ${weekLabel}`}
        className={`${BASE_INPUT_CLASSES} ${widthClassName} ${paddingClassName} border-indigo-500 focus:ring-indigo-400 focus:border-indigo-400`}
      />
    );
  }

  return (
    <span className="font-semibold tabular-nums">
      {week.present_days ?? week.recommendedPresent}
    </span>
  );
}
