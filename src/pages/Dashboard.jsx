import { useEffect, useMemo, useState } from "react";

import KPICards from "../components/KPICards";
import AnalyticsChart from "../components/AnalyticsChart";
import DataTable from "../components/DataTable/DataTable";
import WorkCalendar from "../components/WorkCalendar/WorkCalendar";
import { DEFAULT_OPTIONS } from "../utils/forecast/constants";

export default function Dashboard({
  dashboard,
  reload,

  planningMode,
  setPlanningMode,

  plannedWeeks,
  setPlannedWeeks,

  calendarEvents,
  reloadCalendarEvents,

  currentUser,
  logout,
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-700 pb-4 md:pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Hybrid Rhythm
            </h1>

            <p className="text-slate-400 mt-1">Attendance Planning Dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <span className="text-sm text-slate-400">{currentUser.email}</span>

            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </header>

        <KPICards summary={dashboard.summary} />

        <AnalyticsChart
          data={dashboard.chartData}
          planningMode={planningMode}
        />

        <div className="mt-4 md:mt-0 flex items-center gap-3 self-start md:self-auto">
          <span
            className={`text-sm font-medium ${
              planningMode ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            Planning Mode
          </span>

          <button
            type="button"
            onClick={() => setPlanningMode(!planningMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
              planningMode ? "bg-emerald-500" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                planningMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <DataTable
          weeks={dashboard.weeks}
          reload={reload}
          planningMode={planningMode}
          plannedWeeks={plannedWeeks}
          setPlannedWeeks={setPlannedWeeks}
          currentUser={currentUser}
        />
        <WorkCalendar
          calendarEvents={calendarEvents}
          reloadCalendarEvents={reloadCalendarEvents}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}
