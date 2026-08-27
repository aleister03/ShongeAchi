import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, pick, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
import Payment from "@/models/Payment.js";
import Visit from "@/models/Visit.js";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth.js";


const UPDATE_FIELDS = ["name", "serviceArea", "phone", "shift", "experienceYears", "maxWorkload", "verificationStatus", "active"];

export async function GET(_request, context) {
  try {
    const auth = requireAuth(_request, ["admin", "checker"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "checker id");
    if (auth.role === "checker" && String(auth.checkerId) !== id) {
      throw new ApiError(403, "You can only view your own record");
    }
    const checker = await Checker.findById(id).populate("assignedElders", "name address visitSchedule concernStatus").lean();
    if (!checker) throw new ApiError(404, "Checker not found");
    const monthStart = new Date();
    monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    const [visits, payments] = await Promise.all([
      Visit.find({ checkerId: id, visitDate: { $gte: monthStart } }).lean(),
      Payment.find({ checkerId: id, status: "paid", paidAt: { $gte: monthStart } }).lean()
    ]);
    const scheduledVisits = visits.filter((visit) => visit.scheduledAt);
    const onTime = scheduledVisits.filter((visit) => visit.completedAt && visit.completedAt <= visit.scheduledAt).length;
    return success({ ...serializeChecker(checker), performance: {
      visitsThisMonth: visits.length,
      onTimeRate: scheduledVisits.length ? (onTime / scheduledVisits.length) * 100 : 0,
      concernFlagsRaised: visits.filter((visit) => visit.status === "Concerned").length,
      earnings: payments.reduce((sum, payment) => sum + payment.amount, 0)
    } });
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
    const updates = pick(await request.json(), UPDATE_FIELDS);
    if (!Object.keys(updates).length) throw new ApiError(400, "No supported fields were provided");
    const existing = await Checker.findById(id).lean();
    if (!existing) throw new ApiError(404, "Checker not found");
    if (updates.maxWorkload !== undefined && updates.maxWorkload < existing.assignedElders.length) {
      throw new ApiError(409, "Max workload cannot be below current workload");
    }
    const checker = await Checker.findByIdAndUpdate(id, updates, { returnDocument: "after", runValidators: true });
    return success(serializeChecker(checker));
  } catch (error) {
    return failure(error);
  }
}

export async function DELETE(_request, context) {
  requireAuth(_request, ["admin"]);
  await connectDB();
  const session = await mongoose.startSession();
  try {
    const { id } = await context.params;
    assertObjectId(id, "checker id");
    let checker;
    await session.withTransaction(async () => {
      checker = await Checker.findByIdAndDelete(id, { session });
      if (!checker) throw new ApiError(404, "Checker not found");
      await Elder.updateMany({ checkerId: id }, { $set: { checkerId: null } }, { session });
    });
    return success({ id, message: "Checker deleted" });
  } catch (error) {
    return failure(error);
  } finally {
    await session.endSession();
  }
}
