import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import { NextResponse, after } from "next/server";
import bcrypt from "bcryptjs";
import { geocodeAddressWithFallback } from "@/lib/geo";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      name,
      phone,
      password,
      serviceArea,
      workingHoursStart,
      workingHoursEnd,
      experienceYears,
      nidPhoto,
      profilePhoto,
    } = body;

    if (!name || !phone || !password || !serviceArea || !nidPhoto || !profilePhoto) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await Checker.findOne({ phone });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this phone number already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // CHANGED: same latency bug as /api/elders POST — geocoding the
    // proposed service area used to be awaited before Checker.create(),
    // which could delay this (already slow, base64-photo-carrying)
    // request by another ~20s and surface as a "Failed to fetch". Create
    // first, geocode in the background.
    const checker = await Checker.create({
      name,
      phone,
      passwordHash,
      serviceArea,
      workingHours: { start: workingHoursStart, end: workingHoursEnd },
      experienceYears: Number(experienceYears) || 0,
      nidPhoto,
      profilePhoto,
      applicationStatus: "Pending",
      verified: false,
      status: "Inactive",
    });

    after(async () => {
      try {
        const coords = await geocodeAddressWithFallback([serviceArea, "Dhaka", "Bangladesh"]);
        if (coords) {
          await Checker.updateOne({ _id: checker._id }, { $set: { serviceLocation: coords } });
        }
      } catch (err) {
        console.error("[checkers/signup] Background geocoding failed:", err);
      }
    });

    // never echo the password hash back to the client
    const { passwordHash: _omit, ...safeChecker } = checker.toObject();

    return NextResponse.json({ success: true, data: safeChecker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
