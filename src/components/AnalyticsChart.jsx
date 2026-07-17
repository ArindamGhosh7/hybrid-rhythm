import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

export default function AnalyticsChart({ data }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-[420px]">
      <h3 className="text-lg font-semibold mb-6">Attendance Trajectory</h3>

      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart data={data}>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

          <XAxis dataKey="week" tick={{ fill: "#94A3B8", fontSize: 12 }} />

          <YAxis yAxisId="days" domain={[0, 5]} tick={{ fill: "#94A3B8" }} />

          <YAxis
            yAxisId="percent"
            orientation="right"
            domain={[40, 70]}
            tick={{ fill: "#94A3B8" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              borderRadius: "0.75rem",
            }}
            labelStyle={{
              color: "#FFFFFF",
              fontWeight: "bold",
              fontSize: "0.875rem",
              marginBottom: "4px",
            }}
            itemStyle={{
              color: "#77faff",
              fontSize: "0.875rem",
              padding: "2px 0",
            }}
          />

          <Legend />

          <ReferenceLine
            yAxisId="percent"
            y={60}
            stroke="#15f7ff"
            strokeDasharray="5 5"
          />

          <Bar
            yAxisId="days"
            dataKey="attendance"
            fill="#475569"
            radius={[4, 4, 0, 0]}
            name="Attendance"
          />

          <Line
            yAxisId="percent"
            dataKey="ytd"
            stroke="#34D399"
            strokeWidth={3}
            dot
            name="Projected YTD"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
