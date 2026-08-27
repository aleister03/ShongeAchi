import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import { requireAuth } from "@/lib/auth.js";

export async function GET(_request, context) {
  try {
    const auth = requireAuth(_request, ["admin", "checker"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "checker id");
    if (auth.role === "checker" && String(auth.checkerId) !== id) {
      throw new ApiError(403, "You can only view your own capacity");
    }
    const checker = await Checker.findById(id);
    if (!checker) throw new ApiError(404, "Checker not found");
    const { currentWorkload, maxWorkload, availableCapacity } = serializeChecker(checker);
    return success({ currentWorkload, maxWorkload, availableCapacity });
  } catch (error) {
    return failure(error);
  }
}

export async function PATCH(request, context) {
  try {
    requireAuth(request, ["admin"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "checker id");
    const body = await request.json();
    requireFields(body, ["maxWorkload"]);
    if (!Number.isInteger(body.maxWorkload) || body.maxWorkload < 1) throw new ApiError(400, "maxWorkload must be a positive integer");
    const checker = await Checker.findOneAndUpdate(
      { _id: id, $expr: { $lte: [{ $size: "$assignedElders" }, body.maxWorkload] } },
      { $set: { maxWorkload: body.maxWorkload } },
      { returnDocument: "after", runValidators: true }
    );
    if (!checker) {
      if (!await Checker.exists({ _id: id })) throw new ApiError(404, "Checker not found");
      throw new ApiError(409, "Max workload cannot be below current workload");
    }
    const { currentWorkload, maxWorkload, availableCapacity } = serializeChecker(checker);
    return success({ currentWorkload, maxWorkload, availableCapacity });
  } catch (error) {
    return failure(error);
  }
}
