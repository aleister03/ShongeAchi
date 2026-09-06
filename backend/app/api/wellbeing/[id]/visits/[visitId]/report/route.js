import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import VisitReport from "@/models/VisitReport";
import AiAssessment from "@/models/AiAssessment";
import { NextResponse } from "next/server";

// GET /api/wellbeing/[id]/visits/[visitId]/report?familyMemberId=...|checkerId=...
//
// Polled by the log-visit screen after a visit is saved. POST /visits
// returns immediately and generates the report in the background, so this
// reports progress: `pending: true` while the AI is still running, then
// the finished report (or a generationFailed placeholder if it didn't
// work out).
//
// CHANGED: once the report is done, the assessment has run too (both are
// kicked off from the same after() block in ../route.js), so it's
// returned alongside rather than making the client poll a second
// endpoint — this is what lets the log-visit result screen show the
// updated concern assessment immediately after a visit is logged.
//
// Cheap by design — indexed lookups — since it's called every couple of
// seconds while pending.
export async function GET(request, context) {
  try {
    await connectDB();
    const { id, visitId } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const checkerId = searchParams.get("checkerId");

    if (!familyMemberId && !checkerId) {
      return NextResponse.json(
        { error: "Provide either familyMemberId or checkerId as a query parameter" },
        { status: 400 }
      );
    }

    const elder = await Elder.findById(id).lean();
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's reports" }, { status: 403 });
    }
    if (checkerId && (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId))) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

    const report = await VisitReport.findOne({ visitId, elderId: id }).lean();
    if (!report) return NextResponse.json({ error: "No report for that visit" }, { status: 404 });

    const assessment = report.pending
      ? null
      : await AiAssessment.findOne({ elderId: id }).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      { success: true, data: { report, aiAssessment: assessment, pending: Boolean(report.pending) } },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

