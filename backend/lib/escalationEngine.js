// backend/lib/escalationEngine.js
//
// Automated Escalation Engine — decides which elders need an escalation
// raised right now, given their visit schedule and recent visit history.
//
// Per the spec: "if a visit is missed, overdue, or marked as 'Unwell' or
// 'No Answer', the system automatically initiates the escalation chain
// without waiting for manual intervention... A scheduled visit remains
// incomplete for four hours. The system immediately notifies the family..."
//
// This capstone build has no persistent background job scheduler (Next.js
// on Vercel has no long-running worker process), so the engine runs
// on-demand instead of on a timer: POST /api/escalations triggers a full
// sweep, either from the admin "Run Escalation Check" button or (later)
// an external cron hitting the same endpoint. The detection logic itself
// is written to be timer-agnostic — it only cares about elapsed time and
// status, not about who or what invoked it.
//
// Pure function: (elders, visits-by-elder, already-open elder ids, now) ->
// list of escalations to create.

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Decide whether one elder needs a new escalation raised right now.
 * Returns null if nothing is wrong, or a finding descriptor otherwise.
 */
function checkElder(elder, visits, now) {
  const escalateAfterHours = elder.visitSchedule?.escalateAfterHours ?? 4;
  const todaysVisit = visits.find((v) => isSameDay(new Date(v.visitDate), now));

  // 1. A visit already happened today and it wasn't fine — escalate on the
  //    outcome itself, don't wait for a timer.
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

  // 2. No visit yet today, but one was expected — escalate once the
  //    missed-check-in window has elapsed. "Elapsed" is measured from the
  //    start of the scheduled day since visits don't carry a target time.
  const todayName = DAY_NAMES[now.getDay()];
  const isScheduledToday = elder.visitSchedule?.days?.includes(todayName);
  if (isScheduledToday && !todaysVisit) {
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    const hoursElapsed = (now - startOfToday) / (1000 * 60 * 60);
    if (hoursElapsed >= escalateAfterHours) {
      return {
        triggerType: "Missed Visit",
        severity: "Elevated",
        reason: `No visit logged for ${elder.name} today (${todayName}) — the ${escalateAfterHours}h check-in window has passed.`,
        relatedVisitId: null,
      };
    }
  }

  return null;
}

/**
 * Sweep every elder and return the escalations that should be created.
 * Elders that already have an open escalation are skipped — one active
 * escalation per elder at a time; it must be cleared before a new one
 * can be raised.
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