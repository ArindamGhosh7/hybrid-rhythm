import { useEffect, useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { forecast } from "./utils/forecast";
import {
  getAttendanceWeeks,
  ensureCurrentWeekExists,
} from "./services/attendanceService";
import { getCalendarEvents } from "./services/calendarService";
import Login from "./pages/Login";
import { getUserByEmail } from "./services/userService";

function App() {
  const [weeks, setWeeks] = useState([]);
  const [plannedWeeks, setPlannedWeeks] = useState([]);
  const [planningMode, setPlanningMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  async function handleLogin(email) {
    const user = await getUserByEmail(email);

    if (!user) {
      return false;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));

    setCurrentUser(user);

    return true;
  }

  async function loadCalendarEvents(userId) {
    const events = await getCalendarEvents(userId);
    setCalendarEvents(events);

    return events;
  }

  async function loadDashboard() {
    try {
      setLoading(true);

      // Attendance History
      setLoadingStep(0);
      let data = await getAttendanceWeeks(currentUser.id);
      await wait(400);

      // Current Week
      setLoadingStep(1);
      data = await ensureCurrentWeekExists(data, currentUser.id);
      await wait(400);

      // Event Calendar
      setLoadingStep(2);
      const events = await loadCalendarEvents(currentUser.id);
      await wait(400);

      // Dashboard
      setLoadingStep(3);
      setWeeks(data);

      setPlannedWeeks(
        forecast(data, events).weeks.map((week) => ({ ...week })),
      );

      await wait(400);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) {
      loadDashboard();
    }
  }, [currentUser]);

  //Dashboard Data
  const dashboard = useMemo(() => {
    const activeWeeks = planningMode ? plannedWeeks : weeks;

    if (!activeWeeks.length) {
      return null;
    }

    return forecast(activeWeeks, calendarEvents);
  }, [weeks, plannedWeeks, planningMode, calendarEvents]);

  function logout() {
    localStorage.removeItem("currentUser");

    setCurrentUser(null);

    setWeeks([]);
    setPlannedWeeks([]);
    setCalendarEvents([]);
  }

  const loadingMessages = [
    "Loading attendance history...",
    "Loading current week...",
    "Loading work calendar...",
    "Preparing dashboard...",
  ];

  const modules = [
    "Attendance History",
    "Current Week",
    "Event Calendar",
    "Dashboard",
  ];

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }
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

          <h1 className="mt-6 text-3xl font-bold text-white tracking-wide">
            Hybrid Rhythm
          </h1>

          <p className="mt-2 text-slate-400">Preparing your dashboard...</p>

          <div className="mt-10 rounded-xl border border-slate-700 bg-slate-800/60 backdrop-blur-md p-5 text-left shadow-xl">
            {modules.map((module, index) => (
              <div
                key={module}
                className="flex items-center justify-between py-2"
              >
                <span className="text-slate-300">{module}</span>

                {index < loadingStep ? (
                  <span className="text-emerald-400 text-lg">✓</span>
                ) : index === loadingStep ? (
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
                  width: `${((loadingStep + 1) / modules.length) * 100}%`,
                }}
              />
            </div>

            <p className="mt-3 text-center text-xs text-emerald-400 font-medium">
              {loadingMessages[loadingStep]}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Dashboard
      dashboard={dashboard}
      reload={loadDashboard}
      planningMode={planningMode}
      setPlanningMode={setPlanningMode}
      plannedWeeks={plannedWeeks}
      setPlannedWeeks={setPlannedWeeks}
      calendarEvents={calendarEvents}
      reloadCalendarEvents={() => loadCalendarEvents(currentUser.id)}
      currentUser={currentUser}
      logout={logout}
    />
  );
}

export default App;
