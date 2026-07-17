import { useEffect, useRef, useState } from "react";
import { isSameWeek } from "date-fns";
import { updateAttendanceWeek } from "../services/attendanceService";

export default function DataTable({
  weeks,
  actualWeeks,
  reload,
  planningMode,
  plannedWeeks,
  setPlannedWeeks,
}) {
  const [savingId, setSavingId] = useState(null);

  const tableContainerRef = useRef(null);
  const currentWeekRef = useRef(null);

  useEffect(() => {
    if (!tableContainerRef.current || !currentWeekRef.current) return;

    const container = tableContainerRef.current;
    const row = currentWeekRef.current;

    container.scrollTop =
      row.offsetTop - container.clientHeight / 2 + row.clientHeight / 2;
  }, []);

  async function saveWeek(id, value) {
    setSavingId(id);

    try {
      const number = value === "" ? null : Number(value);

      await updateAttendanceWeek(id, number);

      await reload();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingId(null);
    }
  }

  function updatePlannedWeek(id, field, value) {
    setPlannedWeeks((prev) =>
      prev.map((week) => {
        if (week.id !== id) return week;

        return {
          ...week,
          [field]: value === "" ? null : Number(value),
        };
      }),
    );
  }

  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
      <div
        ref={tableContainerRef}
        className="overflow-y-auto max-h-[600px] overflow-x-auto"
      >
        <table className="w-full">
          <thead className="sticky top-0 z-20 bg-slate-900 border-b border-slate-700 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 text-left">Week End</th>

              <th className="px-6 py-4 text-center">Present</th>

              <th className="px-6 py-4 text-center">Eligible</th>

              <th className="px-6 py-4 text-center">Running Present</th>

              <th className="px-6 py-4 text-center">Running Eligible</th>

              <th className="px-6 py-4 text-center">Projected YTD</th>

              <th className="px-6 py-4 text-center">Recommendation</th>
            </tr>
          </thead>

          <tbody>
            {weeks.map((week) => {
              const isCurrentWeek = isSameWeek(
                new Date(week.week_end_date),
                new Date(),
                { weekStartsOn: 1 },
              );

              const isForecast = week.status === "forecast";

              const plannedWeek =
                plannedWeeks.find((w) => w.id === week.id) || week;

              const actualWeek =
                actualWeeks.find((w) => w.id === week.id) || week;

              return (
                <tr
                  key={week.id}
                  ref={isCurrentWeek ? currentWeekRef : null}
                  className={`border-t border-slate-700 transition-colors ${
                    isCurrentWeek
                      ? "bg-emerald-900/20 border-l-4 border-l-emerald-400"
                      : isForecast
                        ? "bg-indigo-950/20"
                        : "hover:bg-slate-700/30"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span>
                        {new Date(week.week_end_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </span>

                      {isCurrentWeek && (
                        <span className="bg-emerald-500 text-slate-900 text-[10px] font-bold rounded-full px-2 py-0.5">
                          CURRENT
                        </span>
                      )}

                      {planningMode && isForecast && (
                        <span className="bg-indigo-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                          PLAN
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="text-center">
                    {isCurrentWeek ? (
                      <input
                        type="number"
                        min={0}
                        max={actualWeek.eligible_days}
                        defaultValue={actualWeek.present_days ?? ""}
                        disabled={savingId === week.id}
                        onBlur={(e) => saveWeek(week.id, e.target.value)}
                        className="w-16 rounded border border-slate-600 bg-slate-900 py-1 text-center"
                      />
                    ) : planningMode && isForecast ? (
                      <input
                        type="number"
                        min={0}
                        max={plannedWeek.eligible_days}
                        value={plannedWeek.present_days ?? ""}
                        onChange={(e) =>
                          updatePlannedWeek(
                            week.id,
                            "present_days",
                            e.target.value,
                          )
                        }
                        className="w-16 rounded border border-indigo-500 bg-slate-900 py-1 text-center"
                      />
                    ) : (
                      <span className="font-semibold">
                        {week.present_days ?? week.recommendedPresent}
                      </span>
                    )}
                  </td>

                  <td className="text-center">
                    {planningMode && isForecast ? (
                      <input
                        type="number"
                        min={0}
                        value={plannedWeek.eligible_days}
                        onChange={(e) =>
                          updatePlannedWeek(
                            week.id,
                            "eligible_days",
                            e.target.value,
                          )
                        }
                        className="w-16 rounded border border-indigo-500 bg-slate-900 py-1 text-center"
                      />
                    ) : (
                      actualWeek.eligible_days
                    )}
                  </td>

                  <td className="text-center">{week.runningPresent}</td>

                  <td className="text-center">{week.runningEligible}</td>

                  <td className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        week.projectedYTD >= 60
                          ? "bg-emerald-900 text-emerald-300"
                          : "bg-red-900 text-red-300"
                      }`}
                    >
                      {week.projectedYTD.toFixed(1)}%
                    </span>
                  </td>

                  <td className="text-center">
                    {isForecast ? (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          week.requiresRecovery
                            ? "bg-amber-900 text-amber-300"
                            : "bg-slate-700 text-slate-200"
                        }`}
                      >
                        {week.recommendedPresent}/{week.eligible_days}
                        {week.requiresRecovery ? " Required" : " Planned"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
