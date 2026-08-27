
import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import Elder from "@/models/Elder.js";
import Visit from "@/models/Visit.js";
import Checker from "@/models/Checker.js";
import VisitReport from "@/models/VisitReport.js";
import { generateVisitReport } from "@/lib/gemini.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { VISIT_QUESTIONS } from "@/lib/visitQuestions.js";
import { deriveLevels } from "@/lib/deriveLevels.js";
import { runAiAssessment } from "@/lib/concernAi.js";

// Mirrors the Visit schema's status enum, so an invalid status is a clean 400 rather
// than a mongoose validation error surfacing as a 500.
const VISIT_STATUSES = ["Fine", "Concerned", "No Answer"];

function validateResponses(responses) {
  if (!Array.isArray(responses)) throw new ApiError(400, "responses must be an array");
  const byId = Object.fromEntries(responses.map((r) => [r.questionId, r]));
  for (const q of VISIT_QUESTIONS) {
    const r = byId[q.id];
    if (!r || !r.answer) throw new ApiError(400, `Missing answer for: ${q.prompt}`);
    if (q.type === "choice" && !q.options.includes(r.answer)) {
      throw new ApiError(400, `Invalid answer for: ${q.prompt}`);
    }
  }
  return responses;
}


export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker", "family"]);
    await connectDB();
    const { id } = await context.params;

    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    return success(await Visit.find({ elderId: id }).sort({ visitDate: -1 }));

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request, context) {
  try {
    const auth = requireAuth(request, ["checker"]);
    await connectDB();
    const { id } = await context.params;

    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id).lean();
    if (!elder) throw new ApiError(404, "Elder not found");
    if (!elder.checkerId) throw new ApiError(409, "Elder does not have an assigned checker");
    if (String(elder.checkerId) !== String(auth.checkerId)) {
      throw new ApiError(403, "You are not the checker assigned to this elder");
    }

    const body = await request.json();
    const responses = validateResponses(body.responses);
    if (!VISIT_STATUSES.includes(body.status)) {
      throw new ApiError(400, `status must be one of: ${VISIT_STATUSES.join(", ")}`);
    }

    // checkerName is required by the Visit schema but is not something the client
    // sends (and shouldn't be trusted from it), so it is read from the assigned
    // checker record here.
    const checker = await Checker.findById(elder.checkerId).lean();
    if (!checker) throw new ApiError(409, "The assigned checker record no longer exists");

    // Built field by field rather than spreading `body`, so a client cannot set
    // server-owned fields such as checkerName or checkerId.
    const visit = await Visit.create({
      elderId: id,
      checkerId: elder.checkerId,
      checkerName: checker.name,
      status: body.status,
      responses,
      visitDate: new Date(),
      // Only carry a schedule slot through if the client supplied one; the admin
      // on-time rate counts only visits that had a scheduledAt, so leaving it unset
      // on an ad-hoc visit keeps that metric meaningful.
      ...(body.scheduledAt ? { scheduledAt: new Date(body.scheduledAt) } : {}),
      completedAt: new Date()
    });

    let report = null;
    try {
      const recentReports = await VisitReport.find({ elderId: id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      // The Visit schema stores only `status` + `responses`; the wellbeing levels are
      // derived. Previously this block read visit.appetiteLevel / visit.moodLevel /
      // visit.notes etc. straight off the document, which are not schema fields, so
      // the model received all-undefined signals.
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
          sleepDisrupted: levels.sleepDisrupted
        },
        recentReports.reverse()
      );

      report = await VisitReport.create({ visitId: visit._id, elderId: id, ...generated });
    } catch (aiError) {
      report = await VisitReport.create({
        visitId: visit._id,
        elderId: id,
        wellbeingScore: 0,
        moodAssessment: "unavailable",
        trendDirection: "Stable",
        flags: [],
        summary: "Report generation failed for this visit.",
        generationFailed: true
      });
      console.error("Visit report generation failed:", aiError.message);
    }

    // Refresh the historical concern assessment (trend across the elder's full visit
    // history, not just this one) now that a new visit exists. runAiAssessment falls
    // back to a deterministic assessment rather than failing, but it is still wrapped
    // here so that nothing on this path can stop the visit from being saved.
    let aiAssessment = null;
    try {
      const assessmentResult = await runAiAssessment(id);
      if (!assessmentResult.skipped) aiAssessment = assessmentResult.assessment;
    } catch (assessmentError) {
      console.error("AI concern assessment failed:", assessmentError.message);
    }

    return success({ visit, report, aiAssessment }, 201);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
