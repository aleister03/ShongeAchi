import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
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
    const s2 = serializeChecker(checker, await Elder.countDocuments({ checkerId: id }));
    return success({ currentWorkload: s2.currentWorkload, maxWorkload: s2.maxWorkload, availableCapacity: s2.availableCapacity });
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

    if (!await Checker.exists({ _id: id })) throw new ApiError(404, "Checker not found");
    const currentWorkload = await Elder.countDocuments({ checkerId: id });
    if (body.maxWorkload < currentWorkload) {
      throw new ApiError(409, `Max workload cannot be below the current workload of ${currentWorkload}`);
    }

    const checker = await Checker.findOneAndUpdate(
      // Capacity can't be guarded with $size any more (Checker.assignedElders was
      // removed by the merge); the current workload is counted from Elder.checkerId
      // before this update runs.
      { _id: id },
      // maxCapacity is the field the merged model defines; writing maxWorkload would
      // be silently discarded by mongoose strict mode. Both are set so either
      // vocabulary reads back correctly.
      { $set: { maxCapacity: body.maxWorkload, maxWorkload: body.maxWorkload } },
      { returnDocument: "after", runValidators: true }
    );
    if (!checker) throw new ApiError(404, "Checker not found");
    const s2 = serializeChecker(checker, await Elder.countDocuments({ checkerId: id }));
    return success({ currentWorkload: s2.currentWorkload, maxWorkload: s2.maxWorkload, availableCapacity: s2.availableCapacity });
  } catch (error) {
    return failure(error);
  }
}
