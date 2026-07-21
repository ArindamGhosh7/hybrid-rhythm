// src/utils/forecast/buildDashboard.js

export default function buildDashboard(weeks) {
  const summary = {
    totalPresent: 0,
    totalEligible: 0,
    currentYTD: 0,
    status: "On Track",
    recoveryMessage: "",
  };

  weeks.forEach((week) => {
    if (week.status === "completed" || week.status === "current") {
      summary.totalPresent += Number(week.present_days ?? 0);
      summary.totalEligible += Number(week.eligible_days);
    }
  });

  summary.currentYTD =
    summary.totalEligible === 0
      ? 0
      : Number(
          ((summary.totalPresent / summary.totalEligible) * 100).toFixed(1),
        );

  const recoveryWeeks = weeks.filter((week) => week.requiresRecovery);

  summary.status = recoveryWeeks.length === 0 ? "On Track" : "Action Required";

  summary.recoveryMessage =
    recoveryWeeks.length === 0
      ? "Keep attending 3 days/week."
      : `Attend ${recoveryWeeks[0].recommendedPresent} day(s) next week.`;

  return {
    summary,

    weeks,

    chartData: weeks.map((week) => ({
      week: new Date(week.week_end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),

      attendance: week.recommendedPresent,

      ytd: week.projectedYTD,
      status: week.status,

      target: 60,
    })),
  };
}
