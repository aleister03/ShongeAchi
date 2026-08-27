import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, pick, success } from "@/lib/api.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
import mongoose from "mongoose";
import { requireAuth, assertElderAccess } from "@/lib/auth.js";


const UPDATE_FIELDS = ["name", "age", "gender", "phone", "address", "bio", "medicalConditions", "mobilityNotes", "emergencyContact", "secondaryContact", "visitSchedule"];

export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const elder = await Elder.findById(id);
    if (!elder) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, elder);
    return success(elder);
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "family"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "elder id");
    const existing = await Elder.findById(id);
    if (!existing) throw new ApiError(404, "Elder not found");
    assertElderAccess(auth, existing);
    const updates = pick(await request.json(), UPDATE_FIELDS);
    if (!Object.keys(updates).length) throw new ApiError(400, "No supported fields were provided");
    const elder = await Elder.findByIdAndUpdate(id, updates, { returnDocument: "after", runValidators: true });
    if (!elder) throw new ApiError(404, "Elder not found");
    return success(elder);
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(request, context) {
  await connectDB();
  requireAuth(request, ["admin"]);
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
