import { useMemo, useState } from "react";

function makeLocalInsight(summary, weeks, calendarEvents) {
  const recovery = summary.recoveryPlan?.[0];
  const futureWeeks = weeks.filter((week) => week.status === "forecast");
  const capacity = futureWeeks.reduce(
    (total, week) => total + Number(week.eligible_days ?? 0),
    0,
  );
  const exclusions = calendarEvents.filter(
    (event) => event.event_type !== "WFH",
  ).length;

  if (recovery) {
    return {
      title: "A small, focused adjustment can protect your target.",
      body: recovery.text,
      action:
        "Open Plan to compare the recovery weeks before changing anything.",
      evidence: `${recovery.daysToAttend} recommended day${recovery.daysToAttend === 1 ? "" : "s"} in the next recovery window · ${capacity} eligible future day${capacity === 1 ? "" : "s"} currently available`,
    };
  }

  return {
    title: "Your recorded pattern is supporting the target.",
    body: `You are currently at ${summary.currentYTD.toFixed(1)}% against a ${summary.targetYTD.toFixed(0)}% target.`,
    action:
      "Keep logging actual office days; use Plan only for upcoming changes.",
    evidence: `${summary.totalPresent} recorded office day${summary.totalPresent === 1 ? "" : "s"} · ${exclusions} eligibility exception${exclusions === 1 ? "" : "s"} on the calendar`,
  };
}

export default function InsightAssistant({
  summary,
  weeks,
  calendarEvents,
  onOpenPlan,
}) {
  const [expanded, setExpanded] = useState(false);
  const insight = useMemo(
    () => makeLocalInsight(summary, weeks, calendarEvents),
    [summary, weeks, calendarEvents],
  );

  return (
    <section className="assistant-card" aria-labelledby="assistant-title">
      <div className="assistant-orb" aria-hidden="true">
        ✦
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="eyebrow">Rhythm assist</p>
          <span className="local-pill">Local, calculation-based</span>
        </div>
        <h2
          id="assistant-title"
          className="mt-2 text-xl font-semibold text-white"
        >
          {insight.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">{insight.body}</p>
        {expanded && (
          <div className="assistant-details">
            <p>
              <span>Evidence</span>
              {insight.evidence}
            </p>
            <p>
              <span>Guardrail</span>This assistant reads the current dashboard
              only. It does not send data, make policy claims, or change
              attendance records.
            </p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="text-button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "Hide inputs" : "Show inputs & limits"}
          </button>
          <button type="button" className="text-button" onClick={onOpenPlan}>
            Explore a what-if plan →
          </button>
        </div>
      </div>
    </section>
  );
}
