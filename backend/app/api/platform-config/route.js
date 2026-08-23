import connectDB from "@/lib/mongodb";
import PlatformConfig from "@/models/PlatformConfig";
import { getPlatformConfig, SINGLETON_ID } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const config = await getPlatformConfig();
    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function flattenForSet(obj, prefix = "") {
  const out = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(out, flattenForSet(value, path));
    } else {
      out[path] = value;
    }
  }
  return out;
}

export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    await getPlatformConfig();

    const setFields = { ...flattenForSet(body), updatedAt: new Date() };
    const config = await PlatformConfig.findByIdAndUpdate(
      SINGLETON_ID,
      { $set: setFields },
      { new: true, runValidators: true }
    );
    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}