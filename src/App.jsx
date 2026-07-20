import { useEffect, useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { forecast } from "./utils/forecast";
import {
  getAttendanceWeeks,
  ensureCurrentWeekExists,
} from "./services/attendanceService";
import { getCalendarEvents } from "./services/calendarService";

function App() {
  const [weeks, setWeeks] = useState([]);
  const [plannedWeeks, setPlannedWeeks] = useState([]);
  const [planningMode, setPlanningMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState("Initializing...");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function loadCalendarEvents() {
    const events = await getCalendarEvents();
    setCalendarEvents(events);
  }

  async function loadDashboard() {
    try {
      setLoading(true);

      setLoadingStage("Loading attendance history...");
      let data = await getAttendanceWeeks();
      await wait(300);

      setLoadingStage("Ensuring current week...");
      data = await ensureCurrentWeekExists(data);
      await wait(200);

      setLoadingStage("Preparing dashboard...");
      setWeeks(data);
      setPlannedWeeks(data.map((week) => ({ ...week })));
      await wait(200);

      setLoadingStage("Loading work calendar...");
      await loadCalendarEvents();
      await wait(200);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  //Dashboard Data
  const dashboard = useMemo(() => {
    const activeWeeks = planningMode ? plannedWeeks : weeks;

    if (!activeWeeks.length) {
      return null;
    }

    return forecast(activeWeeks);
  }, [weeks, plannedWeeks, planningMode]);

  const modules = [
    "Attendance History",
    "Current Week",
    "Event Calender",
    "Dashboard",
  ];

  const completed =
    {
      "Initializing...": 0,
      "Loading attendance history...": 1,
      "Ensuring current week...": 2,
      "Loading work calendar...": 3,
      "Preparing dashboard...": 4,
    }[loadingStage] ?? 0;

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          {/* Animated Logo */}
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-400 animate-spin"></div>

            <div className="absolute inset-3 rounded-full bg-slate-900 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-wider animate-pulse">
                HR
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="mt-6 text-3xl font-bold text-white tracking-wide">
            Hybrid Rhythm
          </h1>

          <p className="mt-2 text-slate-400">Preparing your dashboard...</p>

          {/* Module Loader */}
          <div className="mt-10 rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur-md p-5 text-left shadow-xl">
            {modules.map((module, index) => (
              <div
                key={module}
                className="flex items-center justify-between py-2"
              >
                <span className="text-slate-300">{module}</span>

                {index < completed ? (
                  <span className="text-emerald-400 text-lg">✓</span>
                ) : index === completed ? (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-600 border-t-emerald-400 animate-spin"></div>
                ) : (
                  <span className="text-slate-600">○</span>
                )}
              </div>
            ))}

            <div className="mt-6 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
                style={{
                  width: `${(completed / modules.length) * 100}%`,
                }}
              />
            </div>

            <p className="mt-3 text-center text-xs text-emerald-400 font-medium">
              {loadingStage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      dashboard={dashboard}
      weeks={weeks}
      reload={loadDashboard}
      planningMode={planningMode}
      setPlanningMode={setPlanningMode}
      plannedWeeks={plannedWeeks}
      setPlannedWeeks={setPlannedWeeks}
      calendarEvents={calendarEvents}
      reloadCalendarEvents={loadCalendarEvents}
    />
  );
}

export default App;
