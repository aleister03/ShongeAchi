// backend/scripts/seed-demo-accounts.mjs
//
// Creates a ready-to-log-in-with demo Checker + Elder, with a few weeks of
// visit history so the concern score / trend chart / escalation engine
// all have real data to show instead of empty states.
//
// Run from the backend/ directory:
//   node scripts/seed-demo-accounts.mjs
//   node scripts/seed-demo-accounts.mjs --clean     (removes the seed data)
//
// Login info after running (see console output too):
//   Family:  sign in at /signin with email "family@shongeachi.demo" and
//            ANY password (there's no real password check yet — see the
//            note on the credentials provider in
//            frontend/app/api/auth/[...nextauth]/route.js). Any password
//            you type the first time becomes "the" password for that
//            email going forward only in the sense that the SAME email
//            always maps to the same account; the password itself is
//            never actually checked.
//   Checker: go to /checker and enter Checker ID  000000000000000000c0ffee
//   Admin:   go to /admin-signin and enter the passcode from
//            ADMIN_PASSCODE in frontend/.env.local (default:
//            shongeachi-admin-2026)

import fs from "fs";
import path from "path";
import { buildVisitResponses } from "./lib/buildVisitResponses.mjs";

function loadEnvLocal() {
  if (process.env.MONGODB_URI) return;
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error(`Could not find ${envPath}`);
    console.error("Run this script from the backend/ directory, or set MONGODB_URI in your shell before running it.");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
  if (!process.env.MONGODB_URI) {
    console.error(`${envPath} exists but doesn't define MONGODB_URI.`);
    process.exit(1);
  }
}
loadEnvLocal();

const { default: connectDB } = await import("../lib/mongodb.js");
const { default: Elder } = await import("../models/Elder.js");
const { default: Checker } = await import("../models/Checker.js");
const { runAiAssessment } = await import("../lib/concernAi.js");
const { default: Visit } = await import("../models/Visit.js");
const mongoose = (await import("mongoose")).default;

const CLEAN_ONLY = process.argv.includes("--clean");

// Fixed, memorable, valid ObjectId (24 hex chars) so the Checker ID can be
// told to you BEFORE you even run this script.
const CHECKER_ID = new mongoose.Types.ObjectId("000000000000000000c0ffee");
const CHECKER_PHONE = "01700000001";
const FAMILY_EMAIL = "family@shongeachi.demo"; // must match what you type at /signin
const ELDER_NAME = "Rahima Khatun (Demo)";

function daysAgo(n, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function clean() {
  const elders = await Elder.find({ familyMemberId: FAMILY_EMAIL }).select("_id");
  const elderIds = elders.map((e) => e._id);
  const visitsDeleted = await Visit.deleteMany({ elderId: { $in: elderIds } });
  const eldersDeleted = await Elder.deleteMany({ familyMemberId: FAMILY_EMAIL });
  const checkersDeleted = await Checker.deleteMany({ _id: CHECKER_ID });
  console.log(
    `Cleaned: ${eldersDeleted.deletedCount} elder(s), ${visitsDeleted.deletedCount} visit(s), ${checkersDeleted.deletedCount} checker(s).`
  );
}

// Tuned (and verified against lib/concernScore.js directly) to land at
// concernScore ≈58 / category "Elevated" with a visible rising trend and
// real contributing factors — so the demo account actually shows off the
// dashboard's amber styling, trend chart, and contributing-factors list
// instead of a flat "Stable / 0%" empty-looking state.
const visitPlan = [
  { daysAgo: 18, status: "Fine", appetite: "Good", mobility: "Good", mood: "Good", med: true, notes: "Normal visit, no concerns." },
  { daysAgo: 14, status: "Fine", appetite: "Good", mobility: "Good", mood: "Good", med: true, notes: "Cheerful, had visitors earlier." },
  { daysAgo: 10, status: "Concerned", appetite: "Poor", mobility: "Fair", mood: "Fair", med: true, notes: "Skipped breakfast, seemed tired." },
  { daysAgo: 6, status: "Fine", appetite: "Poor", mobility: "Fair", mood: "Fair", med: false, notes: "Forgot the evening dose again. Appetite still down." },
  { daysAgo: 3, status: "Concerned", appetite: "Poor", mobility: "Poor", mood: "Fair", med: true, notes: "Slower getting up today. Mentioned dizziness." },
  { daysAgo: 1, status: "Fine", appetite: "Poor", mobility: "Fair", mood: "Fair", med: true, notes: "Ate a little more today but still not back to normal." },
];

async function seed() {
  await clean(); // idempotent re-run

  const checker = await Checker.create({
    _id: CHECKER_ID,
    name: "Demo Checker",
    phone: CHECKER_PHONE,
    email: "checker@shongeachi.demo",
    // Not a real bcrypt hash — fine here since checker login doesn't
    // check a password today (see app/checker/page.js's CheckerIdGate
    // comment); this field only exists to satisfy the schema.
    passwordHash: "not-a-real-hash-seed-only",
    serviceArea: "Dhanmondi",
    workingHours: { start: "08:00", end: "18:00" },
    experienceYears: 5,
    maxCapacity: 20,
    ratePerVisit: 60,
    applicationStatus: "Approved",
    verified: true,
    status: "Active",
  });

  const elder = await Elder.create({
    name: ELDER_NAME,
    age: 72,
    gender: "Female",
    phone: "01700000002",
    address: {
      flatFloor: "2B",
      houseNo: "14",
      road: "Road 9",
      areaTahna: "Dhanmondi",
      city: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    bio: "Demo seed data — safe to delete (node scripts/seed-demo-accounts.mjs --clean).",
    medicalConditions: ["Hypertension"],
    mobilityNotes: "Uses a cane for longer distances.",
    emergencyContact: {
      name: "Demo Emergency Contact",
      phone: "01700000003",
      email: "emergency-contact@shongeachi.demo",
      relationship: "Daughter",
      note: "Seed data — safe to delete",
    },
    familyMemberId: FAMILY_EMAIL,
    familyMemberEmail: FAMILY_EMAIL,
    visitSchedule: { days: ["SAT", "MON", "WED"], scheduledTime: "10:00", escalateAfterHours: 4 },
    assignedCheckerId: checker._id,
    status: "Assigned",
    // CHANGED: isPremium boolean replaced by a real subscription object.
    // Backdated activatedAt + a currentPeriodEnd 30 days out, so the demo
    // elder shows as genuinely Premium (Messages tab, AI concern metrics)
    // without needing to run an actual SSLCommerz checkout first.
    subscription: {
      plan: "premium",
      status: "active",
      activatedAt: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  for (const v of visitPlan) {
    await Visit.create({
      elderId: elder._id,
      checkerId: String(checker._id),
      checkerName: checker.name,
      status: v.status,
      responses: buildVisitResponses({
        appetite: v.appetite,
        mobility: v.mobility,
        mood: v.mood,
        medicationTaken: v.med,
        notes: v.notes,
      }),
      visitDate: daysAgo(v.daysAgo),
    });
  }

  // Pre-populate an AI concern assessment so the demo account's Wellbeing
  // History page shows something immediately, instead of "No assessment
  // yet" until a real visit is logged through the checker portal. Uses
  // whatever GEMINI_API_KEY is configured; falls back to the deterministic
  // trend assessment automatically if it isn't (see lib/concernAi.js).
  try {
    await runAiAssessment(elder._id);
    console.log("Pre-populated an AI concern assessment for the demo elder.");
  } catch (err) {
    console.warn("Could not pre-populate an AI assessment (non-fatal):", err.message);
  }

  console.log("\n=== Seed complete ===\n");
  console.log(`Checker "${checker.name}" — Checker ID: ${checker._id}`);
  console.log(`Elder "${elder.name}" — Elder ID: ${elder._id}`);
  console.log(`Seeded ${visitPlan.length} visits over the last ~3 weeks.\n`);
  console.log("How to log in:");
  console.log(`  Family:  http://localhost:3000/signin`);
  console.log(`           email: ${FAMILY_EMAIL}  (any password)`);
  console.log(`  Checker: http://localhost:3000/checker`);
  console.log(`           Checker ID: ${checker._id}`);
  console.log(`  Admin:   http://localhost:3000/admin-signin`);
  console.log(`           passcode: value of ADMIN_PASSCODE in frontend/.env.local`);
  console.log(`\nTo remove this seed data later: node scripts/seed-demo-accounts.mjs --clean`);
}

async function main() {
  await connectDB();
  try {
    if (CLEAN_ONLY) {
      await clean();
    } else {
      await seed();
    }
  } finally {
    await mongoose.connection.close();
  }
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
