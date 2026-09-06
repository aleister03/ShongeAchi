import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import Visit from "@/models/Visit";
import VisitReport from "@/models/VisitReport";
import { deriveLevels } from "@/lib/deriveLevels";
import { VISIT_QUESTIONS } from "@/lib/visitQuestions";
import { generateVisitReport } from "@/lib/ai";
import { runAiAssessment } from "@/lib/concernAi";
import { NextResponse, after } from "next/server";

const VISIT_STATUSES = ["Fine", "Concerned", "No Answer"];

/** Every question must have a valid answer; a "choice" question's answer must be one of its options. */
function validateResponses(responses) {
  if (!Array.isArray(responses)) {
    throw new Error("responses must be an array");
  }
  const byId = Object.fromEntries(responses.map((r) => [r.questionId, r]));
  for (const q of VISIT_QUESTIONS) {
    const r = byId[q.id];
    // BUG FIX: `!r.answer` rejects an empty string, but q13 ("most
    // noticeable change") is a free-text question the UI explicitly
    // invites the checker to leave blank ("Optional — leave blank if
    // nothing notable"). Only choice-type questions require a genuine
    // answer; a text-type question just needs the entry to be present
    // (so it made it through the form), not non-empty.
    if (!r) throw new Error(`Missing answer for: ${q.prompt}`);
    if (q.type === "choice") {
      if (!r.answer) throw new Error(`Missing answer for: ${q.prompt}`);
      if (!q.options.includes(r.answer)) throw new Error(`Invalid answer for: ${q.prompt}`);
    }
  }
  return responses;
}

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const rawVisits = await Visit.find({ elderId: id }).sort({ visitDate: -1 });
    // Normalized so existing consumers reading v.notes/v.appetiteLevel/etc.
    // (derived from the structured responses) keep working unchanged.
    const visits = rawVisits.map((v) => ({ ...v.toObject(), ...deriveLevels(v.responses) }));
    return NextResponse.json({ success: true, data: visits }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/wellbeing/[id]/visits
// Body: { checkerId, status, responses: [{questionId, answer, detail?}], scheduledAt? }
//
// CHANGED: visits are now logged through a structured 14-question interview
// (lib/visitQuestions.js) instead of four flat dropdowns. Each submission:
//   1. Validates every question has a valid answer.
//   2. Verifies the caller is genuinely the elder's assigned checker (same
//      caller-supplied-id trust model as the rest of this backend).
//   3. Creates the Visit, then a placeholder VisitReport (pending: true) so
//      the client has something to poll immediately.
//   4. Generates the AI per-visit report AND refreshes the elder's AI
//      concern assessment in the background via after() — two Grok calls
//      that together can take up to a couple minutes with retries, which
//      must never hold this response open (see the "Failed to fetch" /
//      socket-hang-up fixes earlier in this project for exactly why).
export async function POST(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const { checkerId, status, responses, scheduledAt } = body;

    if (!checkerId) {
      return NextResponse.json({ error: "checkerId is required" }, { status: 400 });
    }
    if (!VISIT_STATUSES.includes(status)) {
      return NextResponse.json({ error: `status must be one of: ${VISIT_STATUSES.join(", ")}` }, { status: 400 });
    }
    let validatedResponses;
    try {
      validatedResponses = validateResponses(responses);
    } catch (validationError) {
      return NextResponse.json({ error: validationError.message }, { status: 400 });
    }

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (!elder.assignedCheckerId || String(elder.assignedCheckerId) !== String(checkerId)) {
      return NextResponse.json({ error: "This elder is not assigned to you" }, { status: 403 });
    }

    const checker = await Checker.findById(checkerId);
    if (!checker || checker.applicationStatus !== "Approved") {
      return NextResponse.json({ error: "Only approved checkers can log visits" }, { status: 403 });
    }

    const visit = await Visit.create({
      elderId: id,
      checkerId: String(checker._id),
      checkerName: checker.name,
      status,
      responses: validatedResponses,
      visitDate: new Date(),
      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      completedAt: new Date(),
    });

    const report = await VisitReport.create({
      visitId: visit._id,
      elderId: id,
      wellbeingScore: 0,
      moodAssessment: "pending",
      trendDirection: "Stable",
      flags: [],
      summary: "Generating this visit's report…",
      pending: true,
    });

    after(async () => {
      try {
        const recentReports = await VisitReport.find({ elderId: id, pending: false, generationFailed: false })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();

        const levels = deriveLevels(visit.responses);
        const generated = await generateVisitReport(
          elder,
          {
            status: visit.status,
            responses: visit.responses,
            appetite: levels.appetiteLevel,
            mobility: levels.mobilityLevel,
            mood: levels.moodLevel,
            engagement: levels.engagementLevel,
            medicationAdherence: levels.medicationAdherence,
            sleepDisrupted: levels.sleepDisrupted,
          },
          recentReports.reverse()
        );
        await VisitReport.findByIdAndUpdate(report._id, { ...generated, pending: false, generationFailed: false });
      } catch (aiError) {
        console.error("[visits] Visit report generation failed:", aiError.message);
        await VisitReport.findByIdAndUpdate(report._id, {
          wellbeingScore: 0,
          moodAssessment: "unavailable",
          trendDirection: "Stable",
          flags: [],
          summary: "Report generation failed for this visit.",
          pending: false,
          generationFailed: true,
        });
      }

      try {
        await runAiAssessment(id);
      } catch (assessmentError) {
        console.error("[visits] AI concern assessment failed:", assessmentError.message);
      }
    });

    return NextResponse.json({ success: true, data: { visit, report, pending: true } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

