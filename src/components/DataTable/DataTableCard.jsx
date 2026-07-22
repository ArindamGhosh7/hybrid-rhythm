import { StatusBadge, YtdBadge, RecommendationBadge } from "./Badges";
import EditableAttendanceCell from "./EditableAttendanceCell";
import EditableEligibleCell from "./EditableEligibleCell";

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-500 mb-0.5 leading-none">
        {label}
      </p>
      <div className="tabular-nums font-medium leading-tight">{children}</div>
    </div>
  );
}

export default function DataTableCard({
  rowModel,
  planningMode,
  savingId,
  onSave,
  onPlanChange,
  currentWeekRef,
}) {
  const { week, plannedWeek, actualWeek, isCurrentWeek, isForecast } = rowModel;

  return (
    <div
      ref={isCurrentWeek ? currentWeekRef : null}
      role="listitem"
      className={`rounded-lg border p-3 space-y-2 ${
        isCurrentWeek
          ? "bg-emerald-900/20 border-emerald-400/60"
          : isForecast
            ? "bg-indigo-950/20 border-slate-700"
            : "bg-slate-800/60 border-slate-700"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">
          {new Date(week.week_end_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-2">
          {isCurrentWeek && <StatusBadge type="current">CURRENT</StatusBadge>}
          {planningMode && isForecast && (
            <StatusBadge type="plan">PLAN</StatusBadge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <Field label="Present">
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
            widthClassName="w-full"
            paddingClassName="py-1"
          />
        </Field>

        <Field label="Eligible">
          <EditableEligibleCell
            week={week}
            isForecast={isForecast}
            planningMode={planningMode}
            plannedWeek={plannedWeek}
            actualWeek={actualWeek}
            onPlanChange={onPlanChange}
            widthClassName="w-full"
            paddingClassName="py-1"
          />
        </Field>
        {/* 
        <Field label="Running Present">{week.runningPresent}</Field>

        <Field label="Running Eligible">{week.runningEligible}</Field> */}

        <Field label="Projected YTD">
          <YtdBadge value={week.projectedYTD} />
        </Field>

        <Field label="Recommendation">
          <RecommendationBadge week={week} isForecast={isForecast} />
        </Field>
      </div>
    </div>
  );
}
