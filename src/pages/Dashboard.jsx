import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChartNoAxesCombined,
  House,
  SlidersHorizontal,
  Target,
} from "lucide-react";

import AnalyticsChart from "../components/AnalyticsChart";
import AttendanceStepper from "../components/AttendanceStepper";
import DataTable from "../components/DataTable/DataTable";
import InsightAssistant from "../components/InsightAssistant";
import WorkCalendar from "../components/WorkCalendar/WorkCalendar";
import { updateAttendanceWeek } from "../services/attendanceService";

const NAV_ITEMS = [
  { id: "today", label: "Today", icon: House },
  { id: "history", label: "History", icon: ChartNoAxesCombined },
  { id: "plan", label: "Plan", icon: Target },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
];

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
  onOpenSettings,
}) {
  const [activeView, setActiveView] = useState("today");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const currentWeek = useMemo(
    () => dashboard.weeks.find((week) => week.status === "current"),
    [dashboard.weeks],
  );
  console.log(currentWeek);
  const onTrack = dashboard.summary.currentYTD >= dashboard.summary.targetYTD;
  const progress = Math.min(
    100,
    (dashboard.summary.currentYTD / dashboard.summary.targetYTD) * 100,
  );

  async function saveCurrentWeek(value) {
    if (!currentWeek?.id) return;
    try {
      setSaving(true);
      await updateAttendanceWeek(currentWeek.id, value, currentUser.id);
      await reload();
      setNotice("Today’s attendance was saved. Your plan has been refreshed.");
    } catch (error) {
      setNotice("We couldn’t save that change. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function resetPlan() {
    setPlannedWeeks(dashboard.weeks.map((week) => ({ ...week })));
    setNotice("Your draft scenario was reset to the current forecast.");
  }

  const viewTitle = {
    today: "Today",
    history: "History",
    plan: "Plan",
    calendar: "Calendar",
  }[activeView];

  return (
    <div className="app-frame">
      <aside className="side-rail">
        <div className="brand-mark">
          <span>H</span>
          <div>
            <strong>Hybrid Rhythm</strong>
            <small>Attendance, made clear</small>
          </div>
        </div>
        <nav aria-label="Main navigation" className="rail-nav">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveView(id)}
              className={activeView === id ? "nav-item active" : "nav-item"}
            >
              <Icon size={18} aria-hidden="true" /> {label}
            </button>
          ))}
        </nav>
        <div className="rail-bottom">
          <button type="button" className="nav-item" onClick={onOpenSettings}>
            <SlidersHorizontal size={18} aria-hidden="true" /> Preferences
          </button>
          <div className="profile-chip">
            <span>{currentUser.display_name?.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{currentUser.display_name}</strong>
              <small>Personal dashboard</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Personal attendance</p>
            <h1>{viewTitle}</h1>
          </div>
          <div className="top-actions">
            <span className="reporting-period">
              Reporting year ·{" "}
              {Number(currentWeek?.week_end_date?.substring(0, 4))}
            </span>
            <button
              type="button"
              className="icon-settings"
              onClick={onOpenSettings}
              aria-label="Open preferences"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </header>

        {notice && (
          <div role="status" className="toast">
            <span>✓</span>
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        )}

        {activeView === "today" && (
          <div className="view-stack">
            <section className="hero-card">
              <div className="hero-copy">
                <span
                  className={onTrack ? "status-chip good" : "status-chip watch"}
                >
                  {onTrack ? "● On track" : "● Attention needed"}
                </span>
                <h2>
                  {onTrack
                    ? "You’re building a steady rhythm."
                    : "A focused plan can keep you on target."}
                </h2>
                <p>
                  {onTrack
                    ? "Your attendance to date is keeping pace with your GOAL."
                    : dashboard.summary.recoveryPlan?.[0]?.text ||
                      "Review your upcoming weeks to see the clearest next step."}
                </p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setActiveView(onTrack ? "history" : "plan")}
                >
                  {onTrack ? "Review your progress" : "View recovery plan"}{" "}
                  <span>→</span>
                </button>
              </div>
              <div
                className="progress-orbit"
                aria-label={`${dashboard.summary.currentYTD}% attendance against ${dashboard.summary.targetYTD}% target`}
                style={{ "--progress": `${progress}%` }}
              >
                <div>
                  <strong>{dashboard.summary.currentYTD.toFixed(1)}%</strong>
                  <span>to date</span>
                </div>
              </div>
            </section>

            <section className="today-grid">
              <article className="checkin-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">
                      This week - {currentWeek?.week_end_date ?? 0}
                    </p>
                    <h2>Log office attendance</h2>
                  </div>
                  <span className="muted-badge">
                    {currentWeek?.eligible_days ?? 0} eligible days
                  </span>
                </div>
                <p className="card-copy">
                  Update the weekly record when your office days change. You
                  stay in control—nothing saves until you confirm.
                </p>
                {currentWeek ? (
                  <AttendanceStepper
                    value={currentWeek.present_days ?? 0}
                    min={0}
                    max={currentWeek.eligible_days}
                    disabled={saving}
                    onChange={saveCurrentWeek}
                    showSaveButton
                  />
                ) : (
                  <p className="text-slate-400">
                    No current week is available yet.
                  </p>
                )}
                <p className="helper-text">
                  Recorded: {currentWeek?.present_days ?? 0} of{" "}
                  {currentWeek?.eligible_days ?? 0} eligible office days
                </p>
              </article>
              <article className="target-card">
                <p className="eyebrow">Your target</p>
                <div className="target-number">
                  <strong>{dashboard.summary.targetYTD.toFixed(0)}%</strong>
                  <span>attendance goal</span>
                </div>
                <div className="meter">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <div className="target-stats">
                  <span>
                    <b>{dashboard.summary.totalPresent}</b> present
                  </span>
                  <span>
                    <b>{dashboard.summary.totalEligible}</b> eligible
                  </span>
                </div>
                <button
                  type="button"
                  className="text-button mt-5"
                  onClick={onOpenSettings}
                >
                  Adjust target →
                </button>
              </article>
            </section>
            <InsightAssistant
              summary={dashboard.summary}
              weeks={dashboard.weeks}
              calendarEvents={calendarEvents}
              onOpenPlan={() => setActiveView("plan")}
            />
            <section className="week-strip">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">At a glance</p>
                  <h2>Your attendance record</h2>
                </div>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setActiveView("history")}
                >
                  Open history →
                </button>
              </div>
              <div className="week-summary">
                <div>
                  <strong>{dashboard.summary.totalPresent}</strong>
                  <span>Office days recorded</span>
                </div>
                <div>
                  <strong>{dashboard.summary.totalEligible}</strong>
                  <span>Eligible days to date</span>
                </div>
                <div>
                  <strong>{calendarEvents.length}</strong>
                  <span>Calendar exceptions</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === "history" && (
          <div className="view-stack">
            <section className="section-intro">
              <p className="eyebrow">Review & correct</p>
              <h2>Attendance history</h2>
              <p>
                Recorded weeks and projected weeks are kept distinct so your
                history stays auditable.
              </p>
            </section>
            <AnalyticsChart
              data={dashboard.chartData}
              planningMode={planningMode}
            />
            <section className="table-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Weekly record</p>
                  <h2>History & forecast</h2>
                </div>
              </div>
              <DataTable
                weeks={dashboard.weeks}
                reload={reload}
                planningMode={false}
                plannedWeeks={plannedWeeks}
                setPlannedWeeks={setPlannedWeeks}
                currentUser={currentUser}
              />
            </section>
          </div>
        )}

        {activeView === "plan" && (
          <div className="view-stack">
            <section className="plan-hero">
              <div>
                <p className="eyebrow">What-if scenario</p>
                <h2>Shape the rest of your year.</h2>
                <p>
                  Change future weekly office days to see a local projection.
                  This draft is never written to your attendance record.
                </p>
              </div>
              <div className="plan-actions">
                <button
                  type="button"
                  className={
                    planningMode ? "toggle-pill enabled" : "toggle-pill"
                  }
                  onClick={() => setPlanningMode(!planningMode)}
                  aria-pressed={planningMode}
                >
                  {planningMode
                    ? "Scenario editing on"
                    : "Enable scenario editing"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetPlan}
                >
                  Reset draft
                </button>
              </div>
            </section>
            <section className="scenario-summary">
              <div>
                <span>Projected status</span>
                <strong>{dashboard.summary.status}</strong>
              </div>
              <div>
                <span>Current target</span>
                <strong>{dashboard.summary.targetYTD.toFixed(0)}%</strong>
              </div>
              <div>
                <span>Plan changes</span>
                <strong>{planningMode ? "Unsaved draft" : "Baseline"}</strong>
              </div>
            </section>
            <AnalyticsChart
              data={dashboard.chartData}
              planningMode={planningMode}
            />
            <section className="table-section">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Scenario composer</p>
                  <h2>Future weekly plan</h2>
                </div>
                <span className="muted-badge">
                  {planningMode ? "Editing enabled" : "Enable editing above"}
                </span>
              </div>
              <DataTable
                weeks={dashboard.weeks}
                reload={reload}
                planningMode={planningMode}
                plannedWeeks={plannedWeeks}
                setPlannedWeeks={setPlannedWeeks}
                currentUser={currentUser}
              />
            </section>
          </div>
        )}

        {activeView === "calendar" && (
          <div className="view-stack">
            <WorkCalendar
              calendarEvents={calendarEvents}
              reloadCalendarEvents={reloadCalendarEvents}
              currentUser={currentUser}
            />
          </div>
        )}
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={activeView === id ? "active" : ""}
            onClick={() => setActiveView(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
