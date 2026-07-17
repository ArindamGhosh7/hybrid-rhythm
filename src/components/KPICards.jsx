export default function KPICards({ summary }) {
  const onTrack = summary.currentYTD >= 60;

  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <Card
        title="Current YTD"
        value={`${summary.currentYTD.toFixed(1)}%`}
        valueColor={onTrack ? "text-emerald-400" : "text-red-400"}
        badge={onTrack ? "Target Met" : "Below Target"}
        badgeClass={
          onTrack
            ? "bg-emerald-900 text-emerald-300"
            : "bg-red-900 text-red-300"
        }
      />

      <Card title="Present Days" value={summary.totalPresent} suffix="Days" />

      <Card title="Eligible Days" value={summary.totalEligible} suffix="Days" />

      <Card
        title="Recovery Plan"
        value={summary.status}
        subtitle={summary.recoveryMessage}
        valueColor={onTrack ? "text-emerald-400" : "text-amber-300"}
      />
    </section>
  );
}

function Card({
  title,
  value,
  suffix,
  subtitle,
  badge,
  badgeClass,
  valueColor = "text-white",
}) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-5 shadow-sm">
      <p className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">
        {title}
      </p>

      <div className="mt-2 md:mt-3">
        <div className={`text-2xl md:text-3xl font-bold ${valueColor}`}>
          {value}

          {suffix && (
            <span className="text-base md:text-lg ml-2 font-normal text-slate-400">
              {suffix}
            </span>
          )}
        </div>

        {badge && (
          <span
            className={`inline-block mt-3 px-2 py-1 rounded text-xs font-semibold ${badgeClass}`}
          >
            {badge}
          </span>
        )}

        {subtitle && (
          <p className="text-xs md:text-sm text-slate-400 mt-2 md:mt-3 leading-5 md:leading-6">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
