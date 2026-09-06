import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import Escalation from "@/models/Escalation";
import { computeEscalations } from "@/lib/escalationEngine";
import { notifyFamily } from "@/lib/notifyFamily";
import { getPlatformConfig } from "@/lib/platformConfig";


export async function runEscalationSweep() {
  await connectDB();

  // --- NEW: Platform Configuration — drives Disaster Mode (tighter
  // escalation window platform-wide) and whether notifications fire at
  // all for newly raised escalations.
  const platformConfig = await getPlatformConfig();
  // ---------------------------------------------------------------------

  const elders = await Elder.find({ status: "Assigned" });
  const openEscalations = await Escalation.find({ status: "Open" }).select("elderId");
  const openElderIds = new Set(openEscalations.map((e) => String(e.elderId)));

  const checkerIds = elders.map((e) => e.assignedCheckerId).filter(Boolean);
  const checkers = await Checker.find({ _id: { $in: checkerIds } }).select("name");
  const checkerNameById = new Map(checkers.map((c) => [String(c._id), c.name]));

  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
  const recentVisits = await Visit.find({ visitDate: { $gte: twoDaysAgo } }).sort({ visitDate: -1 });

  const visitsByElderId = new Map();
  for (const visit of recentVisits) {
    const key = String(visit.elderId);
    if (!visitsByElderId.has(key)) visitsByElderId.set(key, []);
    visitsByElderId.get(key).push(visit);
  }

  const now = new Date();
  const findings = computeEscalations(elders, visitsByElderId, openElderIds, now, platformConfig);
  const elderById = new Map(elders.map((e) => [String(e._id), e]));

  const created = await Promise.all(
    findings.map(async (f) => {
      const elder = elderById.get(f.elderId);
      const escalation = await Escalation.create({
        elderId: f.elderId,
        elderName: elder?.name || "Unknown elder",
        checkerId: f.checkerId,
        checkerName: f.checkerId ? checkerNameById.get(String(f.checkerId)) || "Unknown checker" : "Unassigned",
        triggerType: f.triggerType,
        severity: f.severity,
        reason: f.reason,
        relatedVisitId: f.relatedVisitId,
        escalationSteps: [
          { stage: "Family Notified", note: "Simulated notification sent to the family contact chain.", at: now },
        ],
      });

      // Respect the Platform Configuration notification toggle — if an
      // admin has switched escalation notifications off platform-wide,
      // the Escalation record is still raised (so it shows up in the
      // admin queue), it just doesn't fan out to notifyFamily().
      if (elder && platformConfig.notificationRules?.escalationNotificationsEnabled !== false) {
        await notifyFamily(elder, escalation);
      }

      return escalation;
    })
  );

  return { scanned: elders.length, newEscalations: created.length, escalations: created, disasterModeActive: !!platformConfig.disasterMode?.enabled };
}