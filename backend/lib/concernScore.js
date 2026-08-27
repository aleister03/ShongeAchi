// Deterministic concern score, extracted from wellbeing/[id]/concern-score/route.js
// so it can be reused wherever a non-AI baseline score is needed (e.g. the AI
// concern assessment uses it as `deterministicScoreAtRun` for comparison).
export function calculateConcernScore(visits) {
  if (visits.length === 0) return 0;
  let score = 0;
  visits.forEach(visit => {
    if (visit.status === "Concerned") score += 15;
    if (visit.status === "No Answer") score += 20;
    if (visit.appetiteLevel === "Poor") score += 10;
    if (visit.appetiteLevel === "Fair") score += 5;
    if (visit.mobilityLevel === "Poor") score += 10;
    if (visit.mobilityLevel === "Fair") score += 5;
    if (visit.moodLevel === "Poor") score += 10;
    if (!visit.medicationTaken) score += 10;
  });
  return Math.min(Math.round(score / visits.length), 100);
}
