// src/utils/forecast/recoverTarget.js

import simulateProjection from "./simulateProjection";
import { DEFAULT_OPTIONS } from "./constants";

function getRemainingDaysInCurrentWeek(referenceDate = new Date()) {
  const today = referenceDate.getDay(); // 0=Sun, 1=Mon, ..., 5=Fri, 6=Sat
  if (today === 0 || today === 6) return 0; // Weekend
  return 5 - today + 1; // Mon: 5, Tue: 4, Wed: 3, Thu: 2, Fri: 1
}

export default function recoverTarget(totals, options = DEFAULT_OPTIONS) {
  let simulated = simulateProjection(totals);
  const targetYTD = options.targetPercentage * 100;

  for (let i = 0; i < simulated.length; i++) {
    const week = simulated[i];

    if (week.status === "completed") continue;

    // Calculate maximum physical capacity for this week
    let maxCap = Number(week.eligible_days ?? 0);
    if (week.status === "current") {
      const loggedPresent = Number(week.present_days ?? 0);
      maxCap = loggedPresent + getRemainingDaysInCurrentWeek();
    }

    let modified = false;

    // Batch increment days until week meets target OR hits max capacity
    while (
      simulated[i].projectedYTD < targetYTD &&
      simulated[i].recommendedPresent < maxCap
    ) {
      simulated[i].recommendedPresent += 1;
      simulated[i].extraDays = (simulated[i].extraDays ?? 0) + 1;
      simulated[i].requiresRecovery = true;
      modified = true;

      // Recalculate projection to check if target was met
      simulated = simulateProjection(simulated);
    }
  }

  return simulated;
}
