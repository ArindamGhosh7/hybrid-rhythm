export default function calculateRunningTotals(projected) {
  let totalPresent = 0;
  let totalEligible = 0;

  return projected.map((week) => {
    const present =
      week.present_days === null
        ? Number(week.recommendedPresent ?? 0)
        : Number(week.present_days);
    const eligible = Number(week.eligible_days);

    totalPresent += present;
    totalEligible += eligible;

    const ytd = totalEligible === 0 ? 0 : (totalPresent / totalEligible) * 100;

    return {
      ...week,

      runningPresent: totalPresent,

      runningEligible: totalEligible,

      runningYTD: Number(ytd.toFixed(1)),
    };
  });
}
