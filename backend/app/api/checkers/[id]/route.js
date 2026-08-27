import connectDB from "@/lib/mongodb.js";
import { ApiError, assertObjectId, failure, pick, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import Elder from "@/models/Elder.js";
import Payment from "@/models/Payment.js";
import Visit from "@/models/Visit.js";
import mongoose from "mongoose";
import { requireAuth } from "@/lib/auth.js";


import { NextResponse } from "next/server";


export async function GET(request, context) {
  try {
    const auth = requireAuth(request, ["admin", "checker"]);
    await connectDB();
    const { id } = await context.params;

    assertObjectId(id, "checker id");
    if (auth.role === "checker" && String(auth.checkerId) !== id) {
      throw new ApiError(403, "You can only view your own record");
    }
    const checker = await Checker.findById(id).lean();
    if (!checker) throw new ApiError(404, "Checker not found");
    // Checker.assignedElders was removed by the merge; assignment is now recorded on
    // Elder.checkerId, so the roster is queried from that side. populate() threw
    // StrictPopulateError before this change.
    const assignedElders = await Elder.find({ checkerId: id })
      .select("name address visitSchedule concernStatus").lean();
    checker.assignedElders = assignedElders;
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

// Restored after a bad merge: the teammate's checker-detail GET body had been spliced
// into the middle of this handler, cutting the transaction off after
// `Elder.updateMany(...)` and leaving references to `visitsThisMonth` and
// `assignedElders`, which do not exist in this scope. The detail payload it built is
// already served by GET above, so this handler is restored to just deleting.
export async function DELETE(_request, context) {
  try {
    requireAuth(_request, ["admin"]);
    await connectDB();
    const { id } = await context.params;
    assertObjectId(id, "checker id");

    const session = await mongoose.startSession();
    try {
      let checker;
      await session.withTransaction(async () => {
        checker = await Checker.findByIdAndDelete(id, { session });
        if (!checker) throw new ApiError(404, "Checker not found");
        // Any elders this checker served become unassigned rather than orphaned.
        await Elder.updateMany({ checkerId: id }, { $set: { checkerId: null } }, { session });
      });
      return success({ deleted: true, _id: id });
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return failure(error);
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const checker = await Checker.findByIdAndUpdate(id, body, { new: true });
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: checker }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
