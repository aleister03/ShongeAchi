import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { geocodeAddressWithFallback } from "@/lib/geo";
import { NextResponse } from "next/server";

// POST /api/geocode/backfill
//
// One-time admin utility: every Elder/Checker created BEFORE geocoding was
// added to the signup/registration routes still has null coordinates.
// This walks through those records and geocodes them, so Intelligent
// Checker Assignment can use real distance scoring for existing data too,
// not just brand-new records. Safe to re-run — only touches records that
// are still missing coordinates.
//
// Uses targeted updateOne() rather than doc.save() — .save() re-validates
// the WHOLE document, and older/bulk-inserted records sometimes have
// unrelated invalid fields (a malformed phone, a missing password hash)
// that would otherwise block this unrelated coordinate write.
//
// Respects Nominatim's ~1 request/second usage policy with a delay
// between calls. NOTE: with a large dataset this can run long enough to
// hit a serverless function timeout — fine for a capstone's mock dataset
// size, but batch this if the dataset ever grows into the hundreds.
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST() {
  try {
    await connectDB();

    const elders = await Elder.find({
      $or: [{ "address.coordinates.lat": null }, { "address.coordinates": { $exists: false } }],
    });
    const checkers = await Checker.find({
      $or: [{ "serviceLocation.lat": null }, { serviceLocation: { $exists: false } }],
    });

    let eldersUpdated = 0;
    const eldersFailed = [];
    for (const elder of elders) {
      try {
        if (!elder.address) {
          eldersFailed.push({ id: String(elder._id), name: elder.name, reason: "no address field on this record" });
          continue;
        }
        const coords = await geocodeAddressWithFallback(
          [elder.address?.road, elder.address?.areaTahna, elder.address?.city, elder.address?.country || "Bangladesh"],
          1100
        );
        if (coords) {
          await Elder.updateOne({ _id: elder._id }, { $set: { "address.coordinates": coords } });
          eldersUpdated += 1;
        } else {
          eldersFailed.push({
            id: String(elder._id),
            name: elder.name,
            reason: "no geocoding match found",
            address: elder.address?.areaTahna || elder.address?.city || "(no area/city set)",
          });
        }
      } catch (err) {
        eldersFailed.push({ id: String(elder._id), name: elder.name, reason: err.message });
      }
      await sleep(1100);
    }

    let checkersUpdated = 0;
    const checkersFailed = [];
    for (const checker of checkers) {
      try {
        const coords = await geocodeAddressWithFallback([checker.serviceArea, "Dhaka", "Bangladesh"], 1100);
        if (coords) {
          await Checker.updateOne({ _id: checker._id }, { $set: { serviceLocation: coords } });
          checkersUpdated += 1;
        } else {
          checkersFailed.push({ id: String(checker._id), name: checker.name, reason: "no geocoding match found", serviceArea: checker.serviceArea });
        }
      } catch (err) {
        checkersFailed.push({ id: String(checker._id), name: checker.name, reason: err.message });
      }
      await sleep(1100);
    }

    return NextResponse.json(
      {
        success: true,
        data: { eldersScanned: elders.length, eldersUpdated, eldersFailed, checkersScanned: checkers.length, checkersUpdated, checkersFailed },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
