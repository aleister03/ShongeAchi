import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api.js";
import Elder from "@/models/Elder.js";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";
import { assertPremium } from "@/lib/subscription.js";

export async function PUT(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    assertPremium(auth, elder, "Customized visit frequency");
    const body = await request.json();
    requireFields(body, ["days", "escalateAfterHours"]);
    if (!Array.isArray(body.days) || body.escalateAfterHours < 1) throw new ApiError(400, "Invalid visit schedule");
    return success(elder.visitSchedule, 200, { message: "Schedule updated" });
  } catch (error) {
    return failure(error);
  }
}
