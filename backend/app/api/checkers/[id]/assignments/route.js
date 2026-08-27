import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth.js";

async function assignmentRequest(request, context, operation) {
  requireAuth(request, ["admin"]);
  await connectDB();
  const session = await mongoose.startSession();
  try {
    const { id } = await context.params;
    const body = await request.json();
    requireFields(body, ["elderId"]);
    assertObjectId(id, "checker id");
    assertObjectId(body.elderId, "elder id");
    let checker;
    await session.withTransaction(async () => {
      checker = await operation({ checkerId: id, elderId: body.elderId, session });
    });
    return success(serializeChecker(checker), operation === assign ? 201 : 200);
  } catch (error) {
    return failure(error);
  } finally {
    await session.endSession();
  }
}

// Rewritten for the merged schema. Checker.assignedElders was removed, so:
//   - the $size capacity filter errored ("argument to $size must be an array")
//   - $push wrote to a path mongoose strips, so nothing was recorded on the checker
//   - $pull on unassign matched nothing, so every unassign returned 404
// Elder.checkerId is now the single source of truth for assignment, and capacity is
// checked by counting elders inside the same transaction.
async function assign({ checkerId, elderId, session }) {
  const elder = await Elder.findOne({ _id: elderId, checkerId: null }).session(session);
  if (!elder) throw new ApiError(409, "Elder is already assigned or does not exist");

  const checker = await Checker.findOne({
    _id: checkerId,
    $and: [
      { $or: [{ status: "Active" }, { active: true }] },
      { $or: [{ verified: true }, { verificationStatus: "verified" }, { applicationStatus: "Approved" }] }
    ]
  }).session(session);
  if (!checker) throw new ApiError(409, "Checker is unavailable or unverified");

  const maxWorkload = checker.maxCapacity ?? checker.maxWorkload ?? 0;
  const currentWorkload = await Elder.countDocuments({ checkerId }).session(session);
  if (currentWorkload >= maxWorkload) throw new ApiError(409, "Checker is at full capacity");

  elder.checkerId = checker._id;
  await elder.save({ session });
  return serializeChecker(checker, currentWorkload + 1);
}

async function unassign({ checkerId, elderId, session }) {
  const elder = await Elder.findOneAndUpdate(
    { _id: elderId, checkerId }, { $set: { checkerId: null } }, { returnDocument: "after", session }
  );
  if (!elder) throw new ApiError(404, "Assignment not found");

  const checker = await Checker.findById(checkerId).session(session);
  if (!checker) throw new ApiError(404, "Checker not found");
  return serializeChecker(checker, await Elder.countDocuments({ checkerId }).session(session));
}

export function POST(request, context) {
  return assignmentRequest(request, context, assign);
}

export function DELETE(request, context) {
  return assignmentRequest(request, context, unassign);
}
