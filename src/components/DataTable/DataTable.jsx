import { useCallback, useEffect, useRef, useState } from "react";
import { updateAttendanceWeek } from "../../services/attendanceService";
import useDataTableRows from "./useDataTableRows";
import DataTableHeader from "./DataTableHeader";
import DataTableRow from "./DataTableRow";
import DataTableCard from "./DataTableCard";

export default function DataTable({
  weeks,
  actualWeeks,
  reload,
  planningMode,
  plannedWeeks,
  setPlannedWeeks,
}) {
  const [savingId, setSavingId] = useState(null);

  // Two independent scroll containers (desktop table / mobile card list) -
  // only one is visible at a time via CSS, but both exist in the DOM, so
  // each needs its own container + current-week ref.
  const desktopContainerRef = useRef(null);
  const desktopCurrentRowRef = useRef(null);
  const mobileContainerRef = useRef(null);
  const mobileCurrentRowRef = useRef(null);

  useEffect(() => {
    function scrollToCurrent(container, row) {
      if (!container || !row) return;

      const topOffset = 100; // Space below sticky header

      container.scrollTop = Math.max(0, row.offsetTop - topOffset);
    }
    console.log("offsetTop:", mobileCurrentRowRef.current?.offsetTop);
    console.log("scrollTop before:", mobileContainerRef.current?.scrollTop);
    scrollToCurrent(desktopContainerRef.current, desktopCurrentRowRef.current);
    scrollToCurrent(mobileContainerRef.current, mobileCurrentRowRef.current);
  }, []);

  const rows = useDataTableRows(weeks, plannedWeeks, actualWeeks);

  const saveWeek = useCallback(
    async (id, value) => {
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
    },
    [reload],
  );

  const updatePlannedWeek = useCallback(
    (id, field, value) => {
      setPlannedWeeks((prev) =>
        prev.map((week) => {
          if (week.id !== id) return week;

          return {
            ...week,
            [field]: value === "" ? null : Number(value),
          };
        }),
      );
    },
    [setPlannedWeeks],
  );

  return (
    <section className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
      {/* Desktop / tablet: original table layout, unchanged */}
      <div
        ref={desktopContainerRef}
        className="hidden md:block overflow-y-auto max-h-[600px] overflow-x-auto"
      >
        <table
          className="w-full"
          aria-label="Weekly attendance and forecast data"
        >
          <DataTableHeader />

          <tbody>
            {rows.map((rowModel) => (
              <DataTableRow
                key={rowModel.week.id}
                rowModel={rowModel}
                planningMode={planningMode}
                savingId={savingId}
                onSave={saveWeek}
                onPlanChange={updatePlannedWeek}
                currentWeekRef={desktopCurrentRowRef}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards - no horizontal scrolling required */}
      <div
        ref={mobileContainerRef}
        role="list"
        aria-label="Weekly attendance and forecast data"
        className="md:hidden overflow-y-auto max-h-[600px] p-3 space-y-3"
      >
        {rows.map((rowModel) => (
          <DataTableCard
            key={rowModel.week.id}
            rowModel={rowModel}
            planningMode={planningMode}
            savingId={savingId}
            onSave={saveWeek}
            onPlanChange={updatePlannedWeek}
            currentWeekRef={mobileCurrentRowRef}
          />
        ))}
      </div>
    </section>
  );
}
