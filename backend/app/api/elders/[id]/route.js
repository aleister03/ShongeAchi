import connectDB from "@/lib/mongodb";
import { ApiError, assertObjectId, failure, pick, success } from "@/lib/api";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import mongoose from "mongoose";

const UPDATE_FIELDS = ["name", "age", "gender", "phone", "address", "bio", "medicalConditions", "mobilityNotes", "emergencyContact", "secondaryContact", "visitSchedule"];

export async function GET(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    return success(elder);
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const updates = pick(await request.json(), UPDATE_FIELDS);
    if (!Object.keys(updates).length) throw new ApiError(400, "No supported fields were provided");
    const elder = await Elder.findByIdAndUpdate(id, updates, { returnDocument: "after", runValidators: true });
    if (!elder) throw new ApiError(404, "Elder not found");
    return success(elder);
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(_request, context) {
  await connectDB();
  const session = await mongoose.startSession();
  try {
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    let elder;
    await session.withTransaction(async () => {
      elder = await Elder.findByIdAndDelete(id, { session });
      if (!elder) throw new ApiError(404, "Elder not found");
      if (elder.checkerId) {
        await Checker.updateOne({ _id: elder.checkerId }, { $pull: { assignedElders: elder._id } }, { session });
      }
    });
    return success({ id, message: "Elder deleted" });
  } catch (error) {
    return failure(error);
  } finally {
    await session.endSession();
  }
}
