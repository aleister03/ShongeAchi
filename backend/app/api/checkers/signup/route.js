import connectDB from "@/lib/mongodb";
import Checker from "@/models/Checker";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

    // never echo the password hash back to the client
    const { passwordHash: _omit, ...safeChecker } = checker.toObject();

    return NextResponse.json({ success: true, data: safeChecker }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
