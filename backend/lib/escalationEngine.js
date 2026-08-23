const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function effectiveEscalateAfterHours(elder, platformConfig) {
  const ownSetting = elder.visitSchedule?.escalateAfterHours ?? platformConfig?.defaultEscalateAfterHours ?? 4;
  if (platformConfig?.disasterMode?.enabled) {
    const ceiling = platformConfig.disasterMode.reducedEscalateAfterHours ?? 1;
    return Math.min(ownSetting, ceiling);
  }
  return ownSetting;
}

function checkElder(elder, visits, now, platformConfig = {}) {
  const escalateAfterHours = effectiveEscalateAfterHours(elder, platformConfig);
  const todaysVisit = visits.find((v) => isSameDay(new Date(v.visitDate), now));

  // 1. A visit already happened today and it wasn't fine
  if (todaysVisit && todaysVisit.status === "No Answer") {
    return {
      triggerType: "No Answer",
      severity: "Critical",
      reason: `${elder.name}'s checker got no answer during today's visit.`,
      relatedVisitId: todaysVisit._id,
    };
  }
  if (todaysVisit && todaysVisit.status === "Concerned") {
    return {
      triggerType: "Concerned",
      severity: "Elevated",
      reason: `${elder.name}'s checker flagged a concern during today's visit.`,
      relatedVisitId: todaysVisit._id,
    };
  }

  // 2. No visit yet today, but one was expected
  const todayName = DAY_NAMES[now.getDay()];
  const isScheduledToday = elder.visitSchedule?.days?.includes(todayName);
  if (isScheduledToday && !todaysVisit) {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const hoursElapsed = (now - startOfToday) / (1000 * 60 * 60);
    if (hoursElapsed >= escalateAfterHours) {
      const disasterNote = platformConfig?.disasterMode?.enabled ? " (Disaster Mode is active)" : "";
      return {
        triggerType: "Missed Visit",
        severity: "Elevated",
        reason: `No visit logged for ${elder.name} today (${todayName}) — the ${escalateAfterHours}h check-in window has passed${disasterNote}.`,
        relatedVisitId: null,
      };
    }
  }

  return null;
}

/**
 * @param {Array} elders
 * @param {Map<string, Array>} visitsByElderId 
 * @param {Set<string>} openElderIds 
 * @param {Date} [now]
 * @param {object} [platformConfig] 
 */
function computeEscalations(elders, visitsByElderId, openElderIds, now = new Date(), platformConfig = {}) {
  const results = [];
  for (const elder of elders) {
    const elderId = String(elder._id);
    if (openElderIds.has(elderId)) continue;
    if (!elder.assignedCheckerId) continue;

    const visits = visitsByElderId.get(elderId) || [];
    const finding = checkElder(elder, visits, now, platformConfig);
    if (finding) {
      results.push({ elderId, checkerId: elder.assignedCheckerId, ...finding });
    }
  }
  return results;
}

export { computeEscalations, checkElder, effectiveEscalateAfterHours };