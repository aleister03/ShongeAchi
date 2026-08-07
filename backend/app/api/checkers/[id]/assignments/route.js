import connectDB from "@/lib/mongodb";
import { ApiError, assertObjectId, failure, requireFields, success } from "@/lib/api";
import { serializeChecker } from "@/lib/checkers";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import mongoose from "mongoose";

async function assignmentRequest(request, context, operation) {
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

async function assign({ checkerId, elderId, session }) {
  const elder = await Elder.findOne({ _id: elderId, checkerId: null }).session(session);
  if (!elder) throw new ApiError(409, "Elder is already assigned or does not exist");
  const checker = await Checker.findOneAndUpdate(
    { _id: checkerId, active: true, verificationStatus: "verified", assignedElders: { $ne: elder._id }, $expr: { $lt: [{ $size: "$assignedElders" }, "$maxWorkload"] } },
    { $push: { assignedElders: elder._id } },
    { returnDocument: "after", runValidators: true, session }
  );
  if (!checker) throw new ApiError(409, "Checker is unavailable, unverified, or at full capacity");
  elder.checkerId = checker._id;
  await elder.save({ session });
  return checker;
}

async function unassign({ checkerId, elderId, session }) {
  const elder = await Elder.findOneAndUpdate(
    { _id: elderId, checkerId }, { $set: { checkerId: null } }, { returnDocument: "after", session }
  );
  if (!elder) throw new ApiError(404, "Assignment not found");
  const checker = await Checker.findOneAndUpdate(
    { _id: checkerId, assignedElders: elderId }, { $pull: { assignedElders: elderId } }, { returnDocument: "after", session }
  );
  if (!checker) throw new ApiError(404, "Assignment not found");
  return checker;
}

export function POST(request, context) {
  return assignmentRequest(request, context, assign);
}

export function DELETE(request, context) {
  return assignmentRequest(request, context, unassign);
}
