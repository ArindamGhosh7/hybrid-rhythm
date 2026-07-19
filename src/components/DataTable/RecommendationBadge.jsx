export default function RecommendationBadge({ week, isForecast }) {
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
