import { DEFAULT_OPTIONS } from "./constants";

export default function buildDashboard(weeks, options = DEFAULT_OPTIONS) {
  const summary = {
    totalPresent: 0,
    totalEligible: 0,
    currentYTD: 0,
    status: "On Track",
    recoveryMessage: "",
    recoveryPlan: [],
  };

  weeks.forEach((week) => {
    if (week.status === "completed" || week.status === "current") {
      summary.totalPresent += Number(week.present_days ?? 0);
      summary.totalEligible += Number(week.eligible_days ?? 0);
    }
  });

  summary.currentYTD =
    summary.totalEligible === 0
      ? 0
      : Number(
          ((summary.totalPresent / summary.totalEligible) * 100).toFixed(1),
        );

  const recoveryWeeks = weeks.filter((week) => week.requiresRecovery);

  if (recoveryWeeks.length === 0) {
    summary.status = "On Track";
    summary.recoveryMessage = "Keep following your current attendance pattern.";
    summary.recoveryPlan = [];
  } else {
    summary.status = "Action Required";

    summary.recoveryPlan = recoveryWeeks.map((week) => {
      const formattedDate = new Date(week.week_end_date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          timeZone: "UTC",
        },
      );

      if (week.status === "current") {
        const logged = Number(week.present_days ?? 0);
        const remainingToAttend = Math.max(
          0,
          Number(week.recommendedPresent ?? 0) - logged,
        );

        return {
          weekEndDate: week.week_end_date,
          status: week.status,
          daysToAttend: remainingToAttend,
          text: `Current Week (${formattedDate}): Attend the remaining ${remainingToAttend} day${
            remainingToAttend === 1 ? "" : "s"
          } including today.`,
        };
      }

      const daysToAttend = Number(week.recommendedPresent ?? 0);

      return {
        weekEndDate: week.week_end_date,
        status: week.status,
        daysToAttend,
        text: `Week ending ${formattedDate}: Attend ${daysToAttend} day${
          daysToAttend === 1 ? "" : "s"
        }.`,
      };
    });

    summary.recoveryMessage =
      `Recovery Plan:\n` +
      summary.recoveryPlan.map((p) => `• ${p.text}`).join("\n");
  }

  return {
    summary,

    weeks,

    chartData: weeks.map((week) => ({
      week: new Date(week.week_end_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        timeZone: "UTC",
      }),

      attendance: week.present_days,

      ytd: week.runningYTD,
      status: week.status,

      target: options.targetPercentage * 100,
    })),
  };
}
