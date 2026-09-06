import PlatformConfig from "@/models/PlatformConfig";
import { getPlatformConfig, SINGLETON_ID } from "@/lib/platformConfig";
import { NextResponse } from "next/server";

// GET /api/platform-config
// Admin-only in intent — same caller-supplied trust model as the rest of
// this backend; no session verification exists yet to enforce it.
export async function GET() {
  try {
    const config = await getPlatformConfig();
    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/platform-config
// Body: any subset of the config fields to change, e.g.
//   { "disasterMode": { "enabled": true } }
//   { "concernScoreThresholds": { "elevated": 35, "critical": 65 } }
//
// IMPORTANT: nested fields are flattened to dot-notation before the
// update. Passing a nested object straight to $set (e.g.
// { disasterMode: { enabled: true } }) would REPLACE the entire
// disasterMode subdocument, silently wiping reducedEscalateAfterHours
// since it wasn't in the submitted object — not what "update just this
// one setting" should mean for an admin settings form.
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
    const body = await request.json();
    await getPlatformConfig(); // ensure the singleton exists before updating

    // CHANGED: the admin settings page sends back the whole config object
    // it got from GET (see frontend app/admin/platform-config/page.js),
    // which includes _id and __v. Flattened into $set, that becomes an
    // update trying to touch _id (immutable — MongoDB only tolerates this
    // because the value happens to be unchanged) and __v (mongoose's
    // internal version key). Neither should ever come from the client.
    const { _id, __v, ...safeBody } = body;

    const setFields = { ...flattenForSet(safeBody), updatedAt: new Date() };
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
