import connectDB from "@/lib/mongodb.js";
import AiAssessment from "@/models/AiAssessment.js";
import Elder from "@/models/Elder.js";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { assertPremium } from "@/lib/subscription.js";
import { runAiAssessment, MIN_VISITS_FOR_AI_ASSESSMENT } from "@/lib/concernAi.js";

// GET: latest concern assessment for an elder, plus recent history for the trend
// graph — same access rule as the other wellbeing endpoints (admin, the elder's
// assigned checker, or the elder's own family member).
export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    assertPremium(auth, elder, "AI concern metrics");

    const history = await AiAssessment.find({ elderId: id }).sort({ createdAt: -1 }).limit(10);
    if (!history.length) {
      return success({
        latest: null,
        history: [],
        minVisitsForAi: MIN_VISITS_FOR_AI_ASSESSMENT,
        message: "No concern assessment yet — it is generated automatically when a visit is logged."
      });
    }

    return success({
      latest: history[0],
      // Oldest first for plotting. `source` travels with each point so the graph can
      // distinguish AI judgements from deterministic fallbacks.
      history: history.slice().reverse().map((a) => ({
        date: a.createdAt,
        aiConcernScore: a.aiConcernScore,
        aiTrend: a.aiTrend,
        concernLevel: a.concernLevel,
        deterministicScore: a.deterministicScoreAtRun,
        source: a.source
      })),
      minVisitsForAi: MIN_VISITS_FOR_AI_ASSESSMENT
    });
  } catch (error) {
    return failure(error);
  }
}

// POST: manually (re)trigger an assessment run. Restricted to admin and the elder's
// assigned checker — mirrors who is allowed to log a visit in the first place, since
// an assessment is only as current as the visit history it reads. Family members view
// assessments (GET) but don't trigger them.
export async function POST(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    assertPremium(auth, elder, "AI concern metrics");

    const result = await runAiAssessment(id);

    // A run is only skipped when there is nothing at all to assess (no visits). AI
    // failures and thin history now produce a deterministic assessment instead, so a
    // 409 here genuinely means "no data yet" rather than "the model was down".
    if (result.skipped) throw new ApiError(409, result.reason);

    return success(result.assessment, 201);
  } catch (error) {
    return failure(error);
  }
}
