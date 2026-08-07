import connectDB from "@/lib/mongodb";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api";
import Elder from "@/models/Elder";

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const body = await request.json();
    requireFields(body, ["days", "escalateAfterHours"]);
    if (!Array.isArray(body.days) || body.escalateAfterHours < 1) throw new ApiError(400, "Invalid visit schedule");
    const elder = await Elder.findByIdAndUpdate(id, { visitSchedule: body }, { returnDocument: "after", runValidators: true });
    if (!elder) throw new ApiError(404, "Elder not found");
    return success(elder.visitSchedule, 200, { message: "Schedule updated" });
  } catch (error) {
    return failure(error);
  }
}
