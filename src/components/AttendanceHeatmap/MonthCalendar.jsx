import DayCell from "./DayCell";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function MonthCalendar({ name, year, weeks }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
      {/* Month Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-100">{name}</h3>

        <span className="text-sm text-slate-400">{year}</span>
      </div>

      {/* Week Days */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="space-y-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <DayCell
                key={day?.date ?? `${weekIndex}-${dayIndex}`}
                day={day}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
