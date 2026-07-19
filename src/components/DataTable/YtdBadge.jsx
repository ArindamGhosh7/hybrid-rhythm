export default function YtdBadge({ value }) {
  const isOnTrack = value >= 60;

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-bold tabular-nums ${
        isOnTrack
          ? "bg-emerald-900 text-emerald-300"
          : "bg-red-900 text-red-300"
      }`}
    >
      {value.toFixed(1)}%
    </span>
  );
}
