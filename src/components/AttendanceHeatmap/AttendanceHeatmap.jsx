import { Calendar } from "lucide-react";

import { buildAttendanceCalendar } from "./heatmapUtils";
import MonthCalendar from "./MonthCalendar";
import HeatmapLegend from "./HeatmapLegend";

export default function AttendanceHeatmap({
  attendance = [],
  year = new Date().getFullYear(),
}) {
  const calendar = buildAttendanceCalendar(attendance, year);

  return (
    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calendar size={22} className="text-indigo-400" />

        <div>
          <h2 className="text-xl font-bold text-slate-100">
            Attendance Heatmap
          </h2>

          <p className="text-sm text-slate-400">
            View your attendance across the entire year.
          </p>
        </div>
      </div>

      <HeatmapLegend />

      {/* Calendar */}
      <div className="space-y-6">
        {calendar.map((month) => (
          <MonthCalendar
            key={`${month.year}-${month.month}`}
            name={month.month}
            year={month.year}
            weeks={month.weeks}
          />
        ))}
      </div>
    </section>
  );
}
