import { StatusBadge, YtdBadge, RecommendationBadge } from "./Badges";
import EditableAttendanceCell from "./EditableAttendanceCell";
import EditableEligibleCell from "./EditableEligibleCell";

export default function DataTableRow({
  rowModel,
  planningMode,
  savingId,
  onSave,
  onPlanChange,
  currentWeekRef,
}) {
  const { week, plannedWeek, actualWeek, isCurrentWeek, isForecast } = rowModel;

  return (
    <tr
      ref={isCurrentWeek ? currentWeekRef : null}
      className={`border-t border-slate-700 transition-colors ${
        isCurrentWeek
          ? "bg-emerald-900/20 border-l-4 border-l-emerald-400"
          : isForecast
            ? "bg-indigo-950/20"
            : "hover:bg-slate-700/30"
      }`}
    >
      <td className="px-4 md:px-6 py-4">
        <div className="flex items-center gap-2">
          <span>
            {new Date(week.week_end_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>

          {isCurrentWeek && <StatusBadge type="current">CURRENT</StatusBadge>}

          {planningMode && isForecast && (
            <StatusBadge type="plan">PLAN</StatusBadge>
          )}
        </div>
      </td>

      <td className="px-4 md:px-6 py-4 text-center">
        <EditableAttendanceCell
          week={week}
          isCurrentWeek={isCurrentWeek}
          isForecast={isForecast}
          planningMode={planningMode}
          plannedWeek={plannedWeek}
          actualWeek={actualWeek}
          savingId={savingId}
          onSave={onSave}
          onPlanChange={onPlanChange}
        />
      </td>

      <td className="px-4 md:px-6 py-4 text-center">
        <EditableEligibleCell
          week={week}
          isForecast={isForecast}
          planningMode={planningMode}
          plannedWeek={plannedWeek}
          actualWeek={actualWeek}
          onPlanChange={onPlanChange}
        />
      </td>

      <td className="px-4 md:px-6 py-4 text-center tabular-nums">
        {week.runningPresent}
      </td>

      <td className="px-4 md:px-6 py-4 text-center tabular-nums">
        {week.runningEligible}
      </td>

      <td className="px-4 md:px-6 py-4 text-center">
        <YtdBadge value={week.projectedYTD} />
      </td>

      <td className="px-4 md:px-6 py-4 text-center">
        <RecommendationBadge week={week} isForecast={isForecast} />
      </td>
    </tr>
  );
}
