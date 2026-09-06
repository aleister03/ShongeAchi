// backend/app/api/elders/route.js
import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import { sendEmail } from "@/lib/mailer";
import { geocodeAddressWithFallback } from "@/lib/geo";
import { NextResponse, after } from "next/server";

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

    // CHANGED: geocoding used to be awaited HERE, before Elder.create() —
    // the comment said "never blocks creation" but the code did exactly
    // that. geocodeAddressWithFallback can chain up to 4 sequential
    // Nominatim requests at up to 5s each (see lib/geo.js), so a single
    // registration could take ~20s to respond, or longer if Nominatim was
    // rate-limiting. That's what surfaced in the browser as an
    // intermittent "Failed to fetch" — a request that hangs long enough
    // gets killed by the browser, a dev proxy, or the user just giving up
    // and navigating away, all of which look identical to a network
    // failure. Create the elder immediately instead, and geocode in the
    // background afterwards — same fire-and-forget pattern already used
    // by /api/geocode/backfill for pre-existing records.
    const elder = await Elder.create(body);

    if (elder.address && !elder.address.coordinates?.lat) {
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
          console.error("[elders] Background geocoding failed:", err);
        }
      });
    }
    // ---------------------------------------------------------------------

    // Best-effort — an email failure must never block (or even delay) the
    // response, so it's scheduled via after() instead of awaited, same as
    // geocoding above.
    if (elder.familyMemberEmail) {
      after(async () => {
        try {
          await sendEmail({
            to: elder.familyMemberEmail,
            subject: `Shonge Achi: Profile created for ${elder.name}`,
            body:
              `A new elder profile for ${elder.name} has been created on Shonge Achi.\n\n` +
              `You'll receive an alert here whenever a scheduled check-in is missed or a checker ` +
              `flags a concern.\n\n` +
              `— Shonge Achi`,
          });
        } catch (emailErr) {
          console.error("[elders] Failed to send registration email:", emailErr);
        }
      });
    }

    return NextResponse.json({ success: true, data: elder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}