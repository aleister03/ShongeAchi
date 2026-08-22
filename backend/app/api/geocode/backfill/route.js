import connectDB from "@/lib/mongodb";
import Elder from "@/models/Elder";
import Checker from "@/models/Checker";
import { geocodeAddressWithFallback } from "@/lib/geo";
import { NextResponse } from "next/server";

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
          elder.address.coordinates = coords;
          await elder.save();
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
          checker.serviceLocation = coords;
          await checker.save();
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
        data: {
          eldersScanned: elders.length,
          eldersUpdated,
          eldersFailed,
          checkersScanned: checkers.length,
          checkersUpdated,
          checkersFailed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}