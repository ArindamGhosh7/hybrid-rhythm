import { ATTENDANCE_STATUS } from "./heatmapUtils";

const STATUS_STYLES = {
  [ATTENDANCE_STATUS.OFFICE]: "bg-emerald-500 hover:bg-emerald-400",

  [ATTENDANCE_STATUS.WFH]: "bg-sky-500 hover:bg-sky-400",

  [ATTENDANCE_STATUS.HOLIDAY]: "bg-amber-400 hover:bg-amber-300",

  [ATTENDANCE_STATUS.LEAVE]: "bg-violet-500 hover:bg-violet-400",

  [ATTENDANCE_STATUS.ABSENT]: "bg-rose-500 hover:bg-rose-400",

  [ATTENDANCE_STATUS.EMPTY]: "bg-slate-700",

  [ATTENDANCE_STATUS.FUTURE]: "bg-slate-800 opacity-40",
};

export default function DayCell({ day }) {
  // Empty calendar cell
  if (!day) {
    return <div className="aspect-square" />;
  }

  return (
    <button
      type="button"
      title={day.date}
      className={`
        aspect-square
        w-full
        rounded-md
        transition-all
        duration-200
        hover:scale-110
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-400
        ${STATUS_STYLES[day.status]}
        `}
    >
      <span className="sr-only">{day.date}</span>
    </button>
  );
}
