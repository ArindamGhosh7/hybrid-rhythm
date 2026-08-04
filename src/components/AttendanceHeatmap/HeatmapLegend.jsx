function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-4 w-4 rounded ${color}`} />

      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}

export default function HeatmapLegend() {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-2">
      <LegendItem color="bg-emerald-500" label="Office" />

      <LegendItem color="bg-sky-500" label="WFH" />

      <LegendItem color="bg-amber-400" label="Holiday" />

      <LegendItem color="bg-rose-500" label="Absent" />

      <LegendItem color="bg-slate-700" label="No Data" />
    </div>
  );
}
