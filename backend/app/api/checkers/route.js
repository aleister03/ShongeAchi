import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import Elder from "@/models/Elder";
import { geocodeAddress } from "@/lib/geo";
import { NextResponse } from "next/server";

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

    if (body.serviceArea && !body.serviceLocation?.lat) {
      const coords = await geocodeAddress(`${body.serviceArea}, Dhaka, Bangladesh`);
      if (coords) body.serviceLocation = coords;
    }

    const checker = await Checker.create(body);
    return NextResponse.json({ success: true, data: checker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}