import { useEffect, useState } from "react";
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
  Cell,
} from "recharts";

export default function AnalyticsChart({ data }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const chartData = (() => {
    if (!isMobile) return data;

    const firstForecast = data.findIndex((week) => week.status === "forecast");

    if (firstForecast === -1) {
      return data.slice(-16);
    }

    const start = Math.max(0, firstForecast - 4);
    const end = Math.min(data.length, firstForecast + 12);

    return data.slice(start, end);
  })();

  const forecastIndex = chartData.findIndex(
    (week) => week.status === "forecast",
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-6 h-[360px] md:h-[420px]">
      <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6">
        Attendance Forecast
      </h3>

      <div className="h-[280px] md:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: isMobile ? -40 : 20,
              left: isMobile ? -45 : 0,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

            {isMobile && forecastIndex >= 0 && (
              <ReferenceLine
                x={forecastIndex}
                stroke="#94A3B8"
                strokeDasharray="4 4"
                label={{
                  value: "Current",
                  position: "insideTop",
                  fill: "#CBD5E1",
                  fontSize: 10,
                }}
              />
            )}

            <XAxis
              dataKey="week"
              tick={{
                fill: "#94A3B8",
                fontSize: isMobile ? 10 : 12,
              }}
              tickMargin={6}
              interval="preserveStartEnd"
              padding={{ left: 0, right: 0 }}
            />

            <YAxis
              yAxisId="days"
              domain={[0, 5]}
              tick={{
                fill: "#94A3B8",
                fontSize: isMobile ? 10 : 12,
              }}
            />

            <YAxis
              yAxisId="percent"
              orientation="right"
              domain={[40, 70]}
              tick={{
                fill: "#94A3B8",
                fontSize: isMobile ? 10 : 12,
              }}
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
                color: "#7795c0",
                fontSize: "0.875rem",
                padding: "2px 0",
              }}
            />

            {!isMobile && <Legend />}

            <ReferenceLine
              yAxisId="percent"
              y={60}
              stroke="#15f7ff"
              strokeDasharray="5 5"
            />

            <Bar
              yAxisId="days"
              dataKey="attendance"
              radius={[4, 4, 0, 0]}
              name="Attendance"
              barSize={isMobile ? 10 : 18}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    index === forecastIndex
                      ? "#FBBF24" // Current Week
                      : entry.status === "forecast"
                        ? "#64748B" // Future Forecast
                        : "#475569" // Completed
                  }
                />
              ))}
            </Bar>

            <Line
              yAxisId="percent"
              dataKey="ytd"
              stroke="#34D399"
              strokeWidth={3}
              name="Projected YTD"
              dot={{ r: isMobile ? 2 : 4 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
