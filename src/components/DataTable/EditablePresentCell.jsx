import AttendanceStepper from "../AttendanceStepper";

const BASE_INPUT_CLASSES =
  "rounded border bg-slate-900 text-center tabular-nums focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

export default function EditablePresentCell({
  week,
  isCurrentWeek,
  isForecast,
  planningMode,
  plannedWeek,
  savingId,
  onSave,
  onPlanChange,
  widthClassName = "w-20",
  paddingClassName = "py-1.5",
}) {
  const weekLabel = `week ending ${week.week_end_date}`;

  if (isCurrentWeek) {
    return (
      <AttendanceStepper
        value={week.present_days}
        min={0}
        max={week.eligible_days}
        disabled={savingId === week.id}
        showSaveButton
        onChange={(value) => onSave(week.id, value)}
      />
    );
  }

  if (planningMode && isForecast) {
    return (
      <AttendanceStepper
        value={plannedWeek.present_days}
        min={0}
        max={plannedWeek.eligible_days}
        onChange={(value) => onPlanChange(week.id, "present_days", value)}
      />
    );
  }

  return (
    <span className="font-semibold tabular-nums">
      {week.present_days ?? week.recommendedPresent}
    </span>
  );
}
