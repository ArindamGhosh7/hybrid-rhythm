const VARIANT_CLASSES = {
  current: "bg-emerald-500 text-slate-900",
  plan: "bg-indigo-500 text-white",
};

export function StatusBadge({ type, children }) {
  return (
    <span
      className={`${VARIANT_CLASSES[type]} text-[10px] font-bold tracking-wide rounded-full px-2 py-0.5 whitespace-nowrap`}
    >
      {children}
    </span>
  );
}

export function RecommendationBadge({ week, isForecast }) {
  if (!isForecast) {
    return "—";
  }

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold tabular-nums ${
        week.requiresRecovery
          ? "bg-amber-900 text-amber-300"
          : "bg-slate-700 text-slate-200"
      }`}
    >
      {week.recommendedPresent}/{week.eligible_days}
      {week.requiresRecovery ? " Required" : " Planned"}
    </span>
  );
}

export function YtdBadge({ value }) {
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
