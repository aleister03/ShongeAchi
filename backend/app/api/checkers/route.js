import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import { geocodeAddressWithFallback } from "@/lib/geo";
import { NextResponse, after } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const search = searchParams.get("search");
    const availableOnly = searchParams.get("availableOnly") === "true";

    const filter = {};
    if (area && area !== "all") filter.serviceArea = area;
    if (search) filter.name = { $regex: search, $options: "i" };

    const checkers = await Checker.find(filter).sort({ createdAt: -1 });

    // workload is computed on the fly from Elder.assignedCheckerId rather than stored as a
    // counter on Checker, so it can never drift out of sync with the actual assignments.
    const withWorkload = await Promise.all(
      checkers.map(async (checker) => {
        const assignedCount = await Elder.countDocuments({ assignedCheckerId: checker._id });
        return {
          ...checker.toObject(),
          assignedCount,
          atCapacity: assignedCount >= checker.maxCapacity,
        };
      })
    );

    const filtered = availableOnly
      ? withWorkload.filter((c) => c.assignedCount < c.maxCapacity)
      : withWorkload;

    return NextResponse.json({ success: true, data: filtered }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // CHANGED: same latency bug as /api/elders POST — geocoding used to be
    // awaited before Checker.create(), so a slow/rate-limited Nominatim
    // call could delay the response by up to ~20s and surface as a
    // "Failed to fetch". Create first, geocode in the background.
    const checker = await Checker.create(body);

    if (checker.serviceArea && !checker.serviceLocation?.lat) {
      after(async () => {
        try {
          const coords = await geocodeAddressWithFallback([checker.serviceArea, "Dhaka", "Bangladesh"]);
          if (coords) {
            await Checker.updateOne({ _id: checker._id }, { $set: { serviceLocation: coords } });
          }
        } catch (err) {
          console.error("[checkers] Background geocoding failed:", err);
        }
      });
    }

    return NextResponse.json({ success: true, data: checker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
