
import fs from "fs";
import path from "path";

// --- Minimal .env.local loader (same pattern as seed-escalation-test.mjs) --
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

const { default: connectDB } = await import("../lib/mongodb.js");
const { default: Elder } = await import("../models/Elder.js");
const { default: Checker } = await import("../models/Checker.js");
const { default: Visit } = await import("../models/Visit.js");
const mongoose = (await import("mongoose")).default;


const args = process.argv.filter((a) => a !== "--clean");
const SEED_TAG = args[2] || "seed-wellbeing-test";
const CLEAN_ONLY = process.argv.includes("--clean");

function makePhone(suffix) {
  return `017${String(suffix).padStart(8, "0")}`;
}

async function clean() {
  const elders = await Elder.find({ familyMemberId: SEED_TAG }).select("_id");
  const elderIds = elders.map((e) => e._id);
  const visitsDeleted = await Visit.deleteMany({ elderId: { $in: elderIds } });
  const eldersDeleted = await Elder.deleteMany({ familyMemberId: SEED_TAG });
  const checkersDeleted = await Checker.deleteMany({ phone: makePhone(88888888) });
  console.log(`Cleaned: ${eldersDeleted.deletedCount} elder(s), ${visitsDeleted.deletedCount} visit(s), ${checkersDeleted.deletedCount} checker(s).`);
}

// Weeks-ago timeline, oldest first. Individually most visits read "Fine",
// but appetite/mobility/mood quietly worsen and one visit is unanswered —
// the trend line should climb even though no single visit looks alarming.
const plan = [
  { weeksAgo: 6, status: "Fine", appetite: "Good", mobility: "Good", mood: "Good", med: true, notes: "Cheerful and responsive. Had a full breakfast." },
  { weeksAgo: 5.5, status: "Fine", appetite: "Good", mobility: "Good", mood: "Good", med: true, notes: "Normal visit, no concerns." },
  { weeksAgo: 5, status: "Fine", appetite: "Good", mobility: "Fair", mood: "Good", med: true, notes: "Slightly slower getting to the door." },
  { weeksAgo: 4, status: "Concerned", appetite: "Poor", mobility: "Fair", mood: "Fair", med: true, notes: "Skipped lunch. Looked tired." },
  { weeksAgo: 3.5, status: "Fine", appetite: "Fair", mobility: "Fair", mood: "Fair", med: false, notes: "Forgot afternoon medication." },
  { weeksAgo: 3, status: "Concerned", appetite: "Poor", mobility: "Poor", mood: "Poor", med: true, notes: "Poor appetite again. Mentioned dizziness." },
  { weeksAgo: 2, status: "Fine", appetite: "Fair", mobility: "Fair", mood: "Fair", med: true, notes: "Normal visit. Mobility still slower than a month ago." },
  { weeksAgo: 1, status: "No Answer", appetite: "Poor", mobility: "Poor", mood: "Poor", med: false, notes: "No response at door. Escalated to family — confirmed at clinic." },
  { weeksAgo: 0.3, status: "Fine", appetite: "Fair", mobility: "Fair", mood: "Fair", med: true, notes: "Responsive and calm. Complained of knee pain while walking." },
];

async function seed() {
  await clean(); // idempotent re-run

  const checker = await Checker.create({
    name: "Seed Wellbeing Checker",
    phone: makePhone(88888888),
    passwordHash: "not-a-real-hash-seed-only",
    serviceArea: "Dhanmondi",
    workingHours: { start: "08:00", end: "18:00" },
    experienceYears: 4,
    maxCapacity: 20,
    ratePerVisit: 60,
    applicationStatus: "Approved",
    verified: true,
    status: "Active",
  });

  const elder = await Elder.create({
    name: "Fatema Begum",
    age: 74,
    gender: "Female",
    phone: makePhone(80000001),
    address: {
      flatFloor: "3A",
      houseNo: "12",
      road: "Road 5",
      areaTahna: "Dhanmondi",
      city: "Dhaka",
      postalCode: "1209",
      country: "Bangladesh",
    },
    bio: "Seed data for wellbeing trend testing — safe to delete.",
    medicalConditions: ["Hypertension", "Diabetes Type 2"],
    mobilityNotes: "Uses a cane for longer distances.",
    emergencyContact: {
      name: "Test Contact",
      phone: makePhone(90000001),
      relationship: "Daughter",
      note: "Seed data — safe to delete",
    },
    familyMemberId: SEED_TAG,
    visitSchedule: { days: ["Saturday", "Monday", "Wednesday"], escalateAfterHours: 4 },
    assignedCheckerId: checker._id,
    status: "Assigned",
  });

  for (const v of plan) {
    const visitDate = new Date(Date.now() - v.weeksAgo * 7 * 24 * 60 * 60 * 1000);
    await Visit.create({
      elderId: elder._id,
      checkerId: String(checker._id),
      checkerName: checker.name,
      status: v.status,
      appetiteLevel: v.appetite,
      mobilityLevel: v.mobility,
      moodLevel: v.mood,
      medicationTaken: v.med,
      notes: v.notes,
      visitDate,
    });
  }

  console.log(`Created checker: ${checker.name} (${checker._id})`);
  console.log(`Created elder: ${elder.name} (${elder._id})`);
  console.log(`Seeded ${plan.length} visits spanning the last ~6 weeks.`);
  console.log(`\nView it at: http://localhost:3000/elder/${elder._id}/profile`);
  console.log(`(uses familyMemberId "${SEED_TAG}" — the dashboard/profile ownership check won't match your real signed-in account, so go straight to the URL above rather than via the dashboard list)`);
  console.log(`\nTo remove this seed data later: node scripts/seed-wellbeing-test.mjs --clean`);
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