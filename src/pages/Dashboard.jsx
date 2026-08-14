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
        <header
          className="
            border-b border-slate-700
            pb-4 md:pb-6
          "
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Brand */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Hybrid Rhythm
              </h1>

              <p className="text-slate-400 mt-1">
                Attendance Planning Dashboard
              </p>
            </div>

            {/* User Section */}
            <div className="flex items-center justify-between md:justify-start gap-3">
              {/* Avatar */}
              <div
                className="
                  shrink-0
                  w-10 h-10
                  rounded-full
                  bg-emerald-500/10
                  border border-emerald-500/30
                  flex items-center justify-center
                  text-emerald-400
                  font-semibold
                  text-sm
                "
              >
                {currentUser.display_name?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">
                  {currentUser.display_name}
                </p>

                <p className="text-xs text-slate-500 truncate max-w-[180px]">
                  {currentUser.email}
                </p>
              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={logout}
                className="
                shrink-0
                ml-2
                rounded-lg
                border border-slate-700
                bg-slate-800
                px-3 py-2
                text-sm
                text-slate-300
                transition

                hover:border-red-500/40
                hover:bg-red-500/10
                hover:text-red-400
              "
              >
                Logout
              </button>
            </div>
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
