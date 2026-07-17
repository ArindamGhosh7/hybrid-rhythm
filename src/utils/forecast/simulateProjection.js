export default function simulateProjection(weeks) {
  let runningPresent = 0;
  let runningEligible = 0;

  return weeks.map((week) => {
    const present =
      week.status === "completed"
        ? Number(week.present_days ?? 0)
        : Number(week.recommendedPresent);

    runningPresent += present;
    runningEligible += Number(week.eligible_days);

    const projectedYTD =
      runningEligible === 0 ? 0 : (runningPresent / runningEligible) * 100;

    return {
      ...week,
      projectedRunningPresent: runningPresent,
      projectedRunningEligible: runningEligible,
      projectedYTD: Number(projectedYTD.toFixed(1)),
    };
  });
}
