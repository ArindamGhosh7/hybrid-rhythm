import { useEffect, useMemo, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { forecast } from "./utils/forecast";
import { getAttendanceWeeks } from "./services/attendanceService";

function App() {
  const [weeks, setWeeks] = useState([]);
  const [plannedWeeks, setPlannedWeeks] = useState([]);
  const [planningMode, setPlanningMode] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const data = await getAttendanceWeeks();

      setWeeks(data);

      setPlannedWeeks(data.map((week) => ({ ...week })));
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

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-emerald-400 rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-slate-400">Loading Dashboard...</p>
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
    />
  );
}

export default App;
