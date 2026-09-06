import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { geocodeAddressWithFallback } from "@/lib/geo";
import { NextResponse, after } from "next/server";

export async function GET(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");

    const elder = await Elder.findById(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });

    // Optional relationship check, same trust model as the wellbeing routes:
    // if a familyMemberId is supplied, it must match the elder's owner.
    // Callers that don't pass one (admin/checker screens) are unaffected.
    if (familyMemberId && elder.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to this elder's profile" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: elder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const familyMemberId = searchParams.get("familyMemberId");
    const body = await request.json();

    const existing = await Elder.findById(id);
    if (!existing) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    if (familyMemberId && existing.familyMemberId !== familyMemberId) {
      return NextResponse.json({ error: "You do not have access to edit this elder's profile" }, { status: 403 });
    }

    // CHANGED: the edit form always resends the whole `address` object
    // without `coordinates` (the frontend never sees or edits that field).
    // A plain findByIdAndUpdate($set-ing the whole subdocument) would
    // silently reset coordinates to null on EVERY save — even an edit
    // that only changed the bio — breaking Intelligent Checker
    // Assignment's distance scoring for any elder who was ever edited.
    // Detect whether the address text actually changed: if not, carry the
    // existing coordinates forward; if it did, re-geocode in the
    // background (never block the response on this).
    let addressChanged = false;
    if (body.address) {
      const fields = ["flatFloor", "houseNo", "road", "areaTahna", "city", "postalCode", "country"];
      addressChanged = fields.some((f) => (body.address[f] || "") !== (existing.address?.[f] || ""));
      if (!addressChanged) {
        body.address = { ...body.address, coordinates: existing.address?.coordinates || null };
      }
    }

    const elder = await Elder.findByIdAndUpdate(id, body, { new: true });

    if (addressChanged && elder?.address) {
      after(async () => {
        try {
          const coords = await geocodeAddressWithFallback([
            elder.address?.road,
            elder.address?.areaTahna,
            elder.address?.city,
            elder.address?.country || "Bangladesh",
          ]);
          if (coords) {
            await Elder.updateOne({ _id: elder._id }, { $set: { "address.coordinates": coords } });
          }
        } catch (err) {
          console.error("[elders] Background re-geocoding on edit failed:", err);
        }
      });
    }
    // ---------------------------------------------------------------------

    return NextResponse.json({ success: true, data: elder }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const elder = await Elder.findByIdAndDelete(id);
    if (!elder) return NextResponse.json({ error: "Elder not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Elder deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}