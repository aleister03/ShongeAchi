
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}


function getScheduledDateTime(now, scheduledTime) {
  const [hours, minutes] = (scheduledTime || "10:00").split(":").map(Number);
  const dt = new Date(now);
  dt.setHours(hours, minutes || 0, 0, 0);
  return dt;
}

function checkElder(elder, visits, now) {
  const escalateAfterHours = elder.visitSchedule?.escalateAfterHours ?? 4;
  const scheduledTime = elder.visitSchedule?.scheduledTime || "10:00";
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

  // 2. No visit yet today, but one was expected — measured from the elder's
  // scheduled visit TIME (e.g. 10:00), not from midnight. A 2-hour window on
  // a 10:00 schedule means the deadline is 12:00, not 02:00.
  const todayName = DAY_NAMES[now.getDay()];
  const isScheduledToday = elder.visitSchedule?.days?.includes(todayName);
  if (isScheduledToday && !todaysVisit) {
    const scheduledAt = getScheduledDateTime(now, scheduledTime);
    const deadline = new Date(scheduledAt.getTime() + escalateAfterHours * 60 * 60 * 1000);
    if (now >= deadline) {
      return {
        triggerType: "Missed Visit",
        severity: "Elevated",
        reason: `No visit logged for ${elder.name} today (${todayName}) — expected by ${scheduledTime}, and the ${escalateAfterHours}h check-in window has now passed.`,
        relatedVisitId: null,
      };
    }
  }

  return null;
}

/**
 *
 * @param {Array} elders - Elder docs (each needs assignedCheckerId, visitSchedule, name).
 * @param {Map<string, Array>} visitsByElderId - elderId (string) -> that elder's visits.
 * @param {Set<string>} openElderIds - elderIds (string) that already have an open escalation.
 * @param {Date} [now]
 */
function computeEscalations(elders, visitsByElderId, openElderIds, now = new Date()) {
  const results = [];
  for (const elder of elders) {
    const elderId = String(elder._id);
    if (openElderIds.has(elderId)) continue; // already being handled
    if (!elder.assignedCheckerId) continue; // nothing to escalate against yet

    const visits = visitsByElderId.get(elderId) || [];
    const finding = checkElder(elder, visits, now);
    if (finding) {
      results.push({ elderId, checkerId: elder.assignedCheckerId, ...finding });
    }
  }
  return results;
}

export { computeEscalations, checkElder };