import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import Escalation from "@/models/Escalation";
import { computeEscalations } from "@/lib/escalationEngine";
import { NextResponse } from "next/server";

// GET /api/escalations?status=Open
// Lists escalations for the admin "active escalations" view. Defaults to
// everything; pass status=Open to see only what still needs attention.
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const filter = {};
    if (status && ["Open", "Cleared"].includes(status)) filter.status = status;

    const escalations = await Escalation.find(filter).sort({ triggeredAt: -1 });
    return NextResponse.json({ success: true, data: escalations }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/escalations
// Runs one sweep of the Automated Escalation Engine right now. Triggered
// by the admin "Run Escalation Check" button (and, later, could be hit by
// an external cron on a timer — the detection logic doesn't care who calls it).
export async function POST() {
  try {
    await connectDB();

    const elders = await Elder.find({ status: "Assigned" });
    const openEscalations = await Escalation.find({ status: "Open" }).select("elderId");
    const openElderIds = new Set(openEscalations.map((e) => String(e.elderId)));

    const checkerIds = elders.map((e) => e.assignedCheckerId).filter(Boolean);
    const checkers = await Checker.find({ _id: { $in: checkerIds } }).select("name");
    const checkerNameById = new Map(checkers.map((c) => [String(c._id), c.name]));

    // Only the last two days of visits are needed for "was today's visit
    // logged" — pulling everything would be wasteful as visit history grows.
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const recentVisits = await Visit.find({ visitDate: { $gte: twoDaysAgo } }).sort({ visitDate: -1 });

    const visitsByElderId = new Map();
    for (const visit of recentVisits) {
      const key = String(visit.elderId);
      if (!visitsByElderId.has(key)) visitsByElderId.set(key, []);
      visitsByElderId.get(key).push(visit);
    }

    const now = new Date();
    const findings = computeEscalations(elders, visitsByElderId, openElderIds, now);
    const elderById = new Map(elders.map((e) => [String(e._id), e]));

    const created = await Promise.all(
      findings.map((f) => {
        const elder = elderById.get(f.elderId);
        return Escalation.create({
          elderId: f.elderId,
          elderName: elder?.name || "Unknown elder",
          checkerId: f.checkerId,
          checkerName: f.checkerId ? checkerNameById.get(String(f.checkerId)) || "Unknown checker" : "Unassigned",
          triggerType: f.triggerType,
          severity: f.severity,
          reason: f.reason,
          relatedVisitId: f.relatedVisitId,
          escalationSteps: [
            {
              stage: "Family Notified",
              note: "Simulated notification sent to the family contact chain.",
              at: now,
            },
          ],
        });
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          scanned: elders.length,
          newEscalations: created.length,
          escalations: created,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}