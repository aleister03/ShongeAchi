import connectDB from "@/lib/mongodb.js";
import { ApiError, failure, pick, requireFields, success } from "@/lib/api.js";
import { serializeChecker } from "@/lib/checkers.js";
import Checker from "@/models/Checker.js";
import { requireAuth } from "@/lib/auth.js";

const CREATE_FIELDS = ["name", "serviceArea", "phone", "shift", "experienceYears", "maxWorkload"];

import Elder from "@/models/Elder";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    requireAuth(request, ["admin"]);
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
    requireAuth(request, ["admin"]);
    await connectDB();
    const body = await request.json();
    const checker = await Checker.create(body);
    return NextResponse.json({ success: true, data: checker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
