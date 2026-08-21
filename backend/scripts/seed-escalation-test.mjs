// backend/scripts/seed-escalation-test.mjs
//
// Seeds a small, self-contained set of elders/checkers/visits designed to
// exercise every branch of the Automated Escalation Engine
// (lib/escalationEngine.js), so you can hit "Run Escalation Check" on the
// admin dashboard and see exactly what should and shouldn't fire.
//
// WHERE TO PUT THIS FILE
//   backend/scripts/seed-escalation-test.mjs
//   (relative imports below assume that location — one level under backend/)
//
// HOW TO RUN
//   cd backend
//   node scripts/seed-escalation-test.mjs
//
//   To remove only the seeded data (and leave everything else untouched):
//   node scripts/seed-escalation-test.mjs --clean
//
// This does NOT touch any of your existing elders/checkers/visits — every
// document it creates is tagged with familyMemberId "seed-escalation-test"
// (on the elders) so re-running the script is idempotent: it deletes its
// own previous run before inserting fresh data, and never matches or
// deletes anything you created by hand or through the app.

import fs from "fs";
import path from "path";

// --- Minimal .env.local loader -------------------------------------------
// Plain `node script.mjs` doesn't auto-load Next.js's .env.local the way
// `next dev` does. IMPORTANT: this has to run and finish BEFORE anything
// that reads process.env.MONGODB_URI is imported — ES module `import`
// statements are hoisted and evaluated before any other top-level code,
// so lib/mongodb.js (which checks MONGODB_URI at import time) must be
// imported dynamically, after this function runs, not statically at the
// top of the file.
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
// ---------------------------------------------------------------------------

// Dynamic imports — deliberately AFTER loadEnvLocal() so MONGODB_URI is
// already in process.env by the time lib/mongodb.js's top-level check runs.
const { default: connectDB } = await import("../lib/mongodb.js");
const { default: Elder } = await import("../models/Elder.js");
const { default: Checker } = await import("../models/Checker.js");
const { default: Visit } = await import("../models/Visit.js");
const mongoose = (await import("mongoose")).default;

const SEED_TAG = "seed-escalation-test"; // used as familyMemberId on every seeded elder
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayName = DAY_NAMES[new Date().getDay()];

const CLEAN_ONLY = process.argv.includes("--clean");

function makePhone(suffix) {
  // Valid BD mobile format the Elder/Checker schemas require: 017/013/018/019/014 + 8 digits.
  return `017${String(suffix).padStart(8, "0")}`;
}

function baseAddress(area) {
  return {
    flatFloor: "3A",
    houseNo: "12",
    road: "Road 5",
    areaTahna: area,
    city: "Dhaka",
    postalCode: "1209",
    country: "Bangladesh",
  };
}

function baseEmergencyContact(suffix) {
  return {
    name: "Test Contact",
    phone: makePhone(90000000 + suffix),
    relationship: "Son",
    note: "Seed data — safe to delete",
  };
}

async function clean() {
  const elders = await Elder.find({ familyMemberId: SEED_TAG }).select("_id");
  const elderIds = elders.map((e) => e._id);
  const visitsDeleted = await Visit.deleteMany({ elderId: { $in: elderIds } });
  const eldersDeleted = await Elder.deleteMany({ familyMemberId: SEED_TAG });
  const checkersDeleted = await Checker.deleteMany({ phone: makePhone(99999999) });
  console.log(`Cleaned: ${eldersDeleted.deletedCount} elder(s), ${visitsDeleted.deletedCount} visit(s), ${checkersDeleted.deletedCount} checker(s).`);
}

async function seed() {
  await clean(); // idempotent re-run

  // --- One checker, active + verified, that every seeded elder is assigned to ---
  const checker = await Checker.create({
    name: "Seed Test Checker",
    phone: makePhone(99999999),
    passwordHash: "not-a-real-hash-seed-only",
    serviceArea: "Dhanmondi",
    workingHours: { start: "08:00", end: "18:00" },
    experienceYears: 3,
    maxCapacity: 20,
    ratePerVisit: 60,
    applicationStatus: "Approved",
    verified: true,
    status: "Active",
  });
  console.log(`Created checker: ${checker.name} (${checker._id})`);

  const now = new Date();

  const scenarios = [
    {
      key: "no-answer",
      name: "Rahima Begum (should escalate — No Answer)",
      expected: "Critical escalation: today's visit was marked No Answer",
      escalateAfterHours: 4,
      scheduledToday: true,
      todaysVisit: { status: "No Answer", appetiteLevel: "Fair", mobilityLevel: "Fair", moodLevel: "Fair", medicationTaken: true },
    },
    {
      key: "concerned",
      name: "Abdul Karim (should escalate — Concerned)",
      expected: "Elevated escalation: today's visit was marked Concerned",
      escalateAfterHours: 4,
      scheduledToday: true,
      todaysVisit: { status: "Concerned", notes: "Seemed disoriented, appetite poor", appetiteLevel: "Poor", mobilityLevel: "Fair", moodLevel: "Poor", medicationTaken: false },
    },
    {
      key: "missed-visit",
      name: "Fatema Khatun (should escalate — Missed Visit)",
      expected: "Elevated escalation: scheduled for today, no visit logged, window elapsed",
      escalateAfterHours: 0, // 0-hour window guarantees it's already "overdue" today, any time after midnight
      scheduledToday: true,
      todaysVisit: null,
    },
    {
      key: "fine-control",
      name: "Nurul Islam (control — should NOT escalate)",
      expected: "No escalation: visited today and marked Fine",
      escalateAfterHours: 4,
      scheduledToday: true,
      todaysVisit: { status: "Fine", appetiteLevel: "Good", mobilityLevel: "Good", moodLevel: "Good", medicationTaken: true },
    },
    {
      key: "not-scheduled-control",
      name: "Momtaz Ali (control — should NOT escalate)",
      expected: "No escalation: not scheduled to be visited today at all",
      escalateAfterHours: 4,
      scheduledToday: false,
      todaysVisit: null,
    },
  ];

  let i = 0;
  for (const scenario of scenarios) {
    i += 1;
    const elder = await Elder.create({
      name: scenario.name,
      age: 68 + i,
      gender: "Female",
      phone: makePhone(70000000 + i),
      address: baseAddress("Dhanmondi"),
      bio: "Seed data for escalation engine testing — safe to delete.",
      medicalConditions: ["Hypertension"],
      mobilityNotes: "",
      emergencyContact: baseEmergencyContact(i),
      familyMemberId: SEED_TAG,
      visitSchedule: {
        days: scenario.scheduledToday ? [todayName] : DAY_NAMES.filter((d) => d !== todayName).slice(0, 2),
        escalateAfterHours: scenario.escalateAfterHours,
      },
      assignedCheckerId: checker._id,
      status: "Assigned",
    });

    if (scenario.todaysVisit) {
      await Visit.create({
        elderId: elder._id,
        checkerId: String(checker._id),
        checkerName: checker.name,
        visitDate: now,
        ...scenario.todaysVisit,
      });
    }

    console.log(`  [${scenario.key}] ${elder.name}  (elderId: ${elder._id})`);
    console.log(`      -> ${scenario.expected}`);
  }

  console.log("\nDone. All seeded elders are assigned to the same checker and use familyMemberId:");
  console.log(`  "${SEED_TAG}"`);
  console.log("\nNext step: open the admin dashboard and click \"Run Escalation Check.\"");
  console.log("Expected result: 3 new escalations (No Answer, Concerned, Missed Visit) — the two controls should not appear.");
  console.log("\nTo remove this seed data later: node scripts/seed-escalation-test.mjs --clean");
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
