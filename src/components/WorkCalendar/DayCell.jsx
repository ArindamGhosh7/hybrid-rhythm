export default function DayCell({ date, eventType }) {
  const colors = {
    HOLIDAY: "bg-red-500",
    LEAVE: "bg-amber-500",
    WFH: "bg-blue-500",
  };

  return (
    <div className="relative flex h-10 w-10 items-center justify-center">
      <span>{date.getDate()}</span>

      {eventType && (
        <span
          className={`absolute bottom-1 right-1 h-2 w-2 rounded-full ${colors[eventType]}`}
        />
      )}
    </div>
  );
}
