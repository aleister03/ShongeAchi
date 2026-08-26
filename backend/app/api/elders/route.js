import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { geocodeAddress } from "@/lib/geo";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const status = searchParams.get("status"); // "Waiting" | "Assigned"

    const filter = {};
    if (familyMemberId) filter.familyMemberId = familyMemberId;
    if (status) filter.status = status;

    const elders = await Elder.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: elders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (body.address && !body.address.coordinates?.lat) {
      const queryParts = [
        body.address.road,
        body.address.areaTahna,
        body.address.city,
        body.address.country || "Bangladesh",
      ].filter(Boolean);
      const coords = await geocodeAddress(queryParts.join(", "));
      if (coords) {
        body.address = { ...body.address, coordinates: coords };
      }
    }

    const elder = await Elder.create(body);
    return NextResponse.json({ success: true, data: elder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}