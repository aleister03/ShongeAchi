import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import Visit from "@/models/Visit";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const checker = await Checker.findById(id);
    if (!checker) return NextResponse.json({ error: "Checker not found" }, { status: 404 });

    const assignedElders = await Elder.find({ assignedCheckerId: id }).select(
      "name address visitSchedule status"
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const visitsThisMonth = await Visit.find({
      checkerId: id,
      visitDate: { $gte: startOfMonth },
    });

    const concernFlags = visitsThisMonth.filter((v) => v.status === "Concerned").length;
    const completed = visitsThisMonth.filter((v) => v.status !== "No Answer").length;
    // NOTE: this is an approximation — "on-time" here means "visit was completed at all"
    // (status !== "No Answer"), since scheduled-vs-actual visit timestamps aren't tracked yet.
    // Swap this for a real punctuality calc once visits store a target arrival window.
    const onTimeRate = visitsThisMonth.length
      ? Math.round((completed / visitsThisMonth.length) * 1000) / 10
      : 0;
    const earnings = visitsThisMonth.length * (checker.ratePerVisit || 60);

    const eldersWithStatus = await Promise.all(
      assignedElders.map(async (elder) => {
        const lastVisit = await Visit.findOne({ elderId: elder._id }).sort({ visitDate: -1 });
        return {
          _id: elder._id,
          name: elder.name,
          address: elder.address,
          visitSchedule: elder.visitSchedule,
          lastVisitStatus: lastVisit?.status || "No visits yet",
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          checker,
          capacity: { assigned: assignedElders.length, max: checker.maxCapacity },
          performance: {
            visitsThisMonth: visitsThisMonth.length,
            onTimeRate,
            concernFlags,
            earnings,
          },
          assignedElders: eldersWithStatus,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
