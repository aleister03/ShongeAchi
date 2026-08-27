
import connectDB from "@/lib/mongodb.js";
import Elder from "@/models/Elder.js";
import VisitReport from "@/models/VisitReport.js";
import Visit from "@/models/Visit";
import { ApiError, assertObjectId, failure, success } from "@/lib/api.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";


export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");

    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);

    if (auth.role === "family" && elder.familyMemberId !== auth.familyMemberId) {
      throw new ApiError(403, "This elder is not linked to your account");
    }
    if (auth.role === "checker" && String(elder.checkerId) !== String(auth.checkerId)) {
      throw new ApiError(403, "This elder is not assigned to you");
    }

    const reports = await VisitReport.find({ elderId: id })
      .sort({ createdAt: 1 })
      .populate({ path: "visitId", select: "visitDate status" });

    return success({
      reports,
      graph: reports.filter((r) => !r.generationFailed).map((r) => ({ date: r.createdAt, score: r.wellbeingScore, trend: r.trendDirection }))
    });
  } catch (error) {
    return failure(error);
  }
}