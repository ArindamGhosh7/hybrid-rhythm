// src/utils/forecast/recoverTarget.js

import simulateProjection from "./simulateProjection";
import { DEFAULT_OPTIONS } from "./constants";

export default function recoverTarget(totals, options = DEFAULT_OPTIONS) {
  let projected = simulateProjection(totals);

  if (!projected.length) {
    return projected;
  }

  const lastWeek = () => projected[projected.length - 1];

  while (lastWeek().projectedYTD < options.targetPercentage * 100) {
    let changed = false;

    for (let i = 0; i < projected.length; i++) {
      const week = projected[i];

      if (week.status !== "forecast") continue;

      if (week.recommendedPresent >= week.eligible_days) continue;

      projected[i] = {
        ...week,
        recommendedPresent: week.recommendedPresent + 1,
        extraDays: week.extraDays + 1,
        requiresRecovery: true,
      };

      changed = true;

      break;
    }

    if (!changed) break;

    projected = simulateProjection(projected);
  }

  return projected;
}
