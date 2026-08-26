import fs from "fs";
import path from "path";

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
const { default: Visit } = await import("../models/Visit.js");
const { default: Escalation } = await import("../models/Escalation.js");
const mongoose = (await import("mongoose")).default;

const args = process.argv.slice(2).filter((a) => a !== "--clean");
const CLEAN_ONLY = process.argv.includes("--clean");
const NAME_OR_ID = args[0];

const DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const FALLBACK_CHECKER_PHONE = "01755512345"; // only used if we need to create a checker

function makeVisitDate(date, hour, minute) {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
}

async function findElder() {
  if (!NAME_OR_ID) {
    console.error('Usage: node scripts/backfill-elder-history.mjs "Elder Name"  [--clean]');
    console.error("       node scripts/backfill-elder-history.mjs <elderId>     [--clean]");
    process.exit(1);
  }

  if (mongoose.Types.ObjectId.isValid(NAME_OR_ID) && NAME_OR_ID.length === 24) {
    const byId = await Elder.findById(NAME_OR_ID);
    if (byId) return byId;
  }

  const matches = await Elder.find({ name: NAME_OR_ID });
  if (matches.length === 0) {
    console.error(`No elder found with name "${NAME_OR_ID}". Register them in the app first, then re-run this script.`);
    process.exit(1);
  }
  if (matches.length > 1) {
    console.error(`Multiple elders named "${NAME_OR_ID}" — re-run with one of these IDs instead:`);
    matches.forEach((m) => console.error(`  ${m._id}  (registered ${m.createdAt?.toDateString()})`));
    process.exit(1);
  }
  return matches[0];
}

async function clean() {
  const elder = await findElder();
  const visitsDeleted = await Visit.deleteMany({ elderId: elder._id });
  const escalationsDeleted = await Escalation.deleteMany({ elderId: elder._id });
  console.log(`Cleaned: ${visitsDeleted.deletedCount} visit(s), ${escalationsDeleted.deletedCount} escalation(s) for "${elder.name}".`);
  console.log(`(The elder profile itself, its createdAt date, and its checker assignment were left as-is — only re-run without --clean if you also want those reset.)`);
}

async function seed() {
  const elder = await findElder();
  console.log(`Found elder: ${elder.name} (${elder._id})`);

  // Wipe any previous run's visits/escalations for this elder first, so
  // re-running is idempotent.
  await Visit.deleteMany({ elderId: elder._id });
  await Escalation.deleteMany({ elderId: elder._id });

  const now = new Date();
  const registeredAt = new Date(now.getTime() - 56 * 24 * 60 * 60 * 1000); // ~8 weeks ago

  // --- Checker: reuse an existing approved+active one, or create one -------
  let checker = await Checker.findOne({ applicationStatus: "Approved", status: "Active" });
  if (!checker) {
    checker = await Checker.create({
      name: "Habibur Rahman",
      phone: FALLBACK_CHECKER_PHONE,
      email: "habibur.checker@example.com",
      passwordHash: "not-a-real-hash-seed-only",
      serviceArea: elder.address?.areaTahna || "Dhaka",
      workingHours: { start: "08:00", end: "18:00" },
      experienceYears: 4,
      maxCapacity: 20,
      ratePerVisit: 70,
      applicationStatus: "Approved",
      verified: true,
      status: "Active",
    });
    console.log(`Created checker: ${checker.name} (${checker._id})`);
  } else {
    console.log(`Reusing existing checker: ${checker.name} (${checker._id})`);
  }

  // Use the elder's own schedule if they already set one during registration;
  // otherwise default to Mon/Wed/Fri at 09:00.
  const scheduleDays = elder.visitSchedule?.days?.length ? elder.visitSchedule.days : ["MON", "WED", "FRI"];
  const scheduledTime = elder.visitSchedule?.scheduledTime || "09:00";
  const [schedHour, schedMinute] = scheduledTime.split(":").map(Number);

  // --- Backdate registration + assign checker -------------------------------
  elder.createdAt = registeredAt;
  elder.assignedCheckerId = checker._id;
  elder.status = "Assigned";
  await elder.save();
  console.log(`Backdated createdAt to ${registeredAt.toDateString()}, assigned checker, set status Assigned.`);

  // --- Visit history: 8 weeks on the elder's own scheduled days, arcing
  // healthy -> rough patch -> recovery.
  const visits = [];
  let concernedVisit = null;
  let noAnswerVisit = null;

  for (let weeksAgo = 7; weeksAgo >= 0; weeksAgo--) {
    const weekStart = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
    for (const dayCode of scheduleDays) {
      const targetDow = DAY_CODES.indexOf(dayCode);
      if (targetDow === -1) continue;
      const d = new Date(weekStart);
      const diff = (targetDow - d.getDay() + 7) % 7;
      d.setDate(d.getDate() + diff);
      if (d > now) continue; // never create future visits
      if (d < registeredAt) continue; // never create visits before the elder "existed"

      let visit;
      if (weeksAgo >= 5) {
        visit = { status: "Fine", appetiteLevel: "Good", mobilityLevel: "Good", moodLevel: "Good", medicationTaken: true, notes: "" };
      } else if (weeksAgo === 4) {
        visit =
          dayCode === scheduleDays[scheduleDays.length - 1]
            ? { status: "Concerned", appetiteLevel: "Poor", mobilityLevel: "Fair", moodLevel: "Fair", medicationTaken: true, notes: "Seemed a bit low energy, ate very little." }
            : { status: "Fine", appetiteLevel: "Fair", mobilityLevel: "Fair", moodLevel: "Good", medicationTaken: true, notes: "" };
      } else if (weeksAgo === 3) {
        if (dayCode === scheduleDays[0]) {
          visit = { status: "No Answer", appetiteLevel: "Fair", mobilityLevel: "Fair", moodLevel: "Fair", medicationTaken: false, notes: "No answer at the door, called family." };
        } else if (scheduleDays[1] && dayCode === scheduleDays[1]) {
          visit = { status: "Concerned", appetiteLevel: "Poor", mobilityLevel: "Poor", moodLevel: "Fair", medicationTaken: false, notes: "Appetite still poor, mobility noticeably worse this week." };
        } else {
          visit = { status: "Fine", appetiteLevel: "Poor", mobilityLevel: "Fair", moodLevel: "Fair", medicationTaken: true, notes: "Improving slightly but still not eating much." };
        }
      } else if (weeksAgo === 2) {
        visit = { status: "Fine", appetiteLevel: "Fair", mobilityLevel: "Fair", moodLevel: "Good", medicationTaken: true, notes: "Doing better, back to her usual self at times." };
      } else {
        visit = { status: "Fine", appetiteLevel: "Good", mobilityLevel: "Good", moodLevel: "Good", medicationTaken: true, notes: "" };
      }

      const visitDate = makeVisitDate(d, schedHour, schedMinute);
      const created = await Visit.create({
        elderId: elder._id,
        checkerId: String(checker._id),
        checkerName: checker.name,
        visitDate,
        ...visit,
      });
      visits.push(created);
      if (visit.status === "Concerned" && weeksAgo === 4) concernedVisit = created;
      if (visit.status === "No Answer") noAnswerVisit = created;
    }
  }
  console.log(`Created ${visits.length} visits spanning up to ~8 weeks.`);

  // --- Past escalations (already Cleared) -----------------------------------
  const toCreate = [];
  if (noAnswerVisit) {
    toCreate.push({
      elderId: elder._id,
      elderName: elder.name,
      checkerId: checker._id,
      checkerName: checker.name,
      triggerType: "No Answer",
      severity: "Critical",
      reason: `${elder.name}'s checker got no answer during the visit.`,
      relatedVisitId: noAnswerVisit._id,
      status: "Cleared",
      escalationSteps: [
        { stage: "Family Notified", note: "Simulated notification sent to the family contact chain.", at: noAnswerVisit.visitDate },
        { stage: "Family Confirmed", note: "Family reached the elder by phone shortly after.", at: new Date(noAnswerVisit.visitDate.getTime() + 45 * 60 * 1000) },
      ],
      triggeredAt: noAnswerVisit.visitDate,
      clearedAt: new Date(noAnswerVisit.visitDate.getTime() + 45 * 60 * 1000),
      clearedNote: "Family confirmed all was well — had stepped out to a neighbor's.",
    });
  }
  if (concernedVisit) {
    toCreate.push({
      elderId: elder._id,
      elderName: elder.name,
      checkerId: checker._id,
      checkerName: checker.name,
      triggerType: "Concerned",
      severity: "Elevated",
      reason: `${elder.name}'s checker flagged a concern during the visit.`,
      relatedVisitId: concernedVisit._id,
      status: "Cleared",
      escalationSteps: [
        { stage: "Family Notified", note: "Simulated notification sent to the family contact chain.", at: concernedVisit.visitDate },
      ],
      triggeredAt: concernedVisit.visitDate,
      clearedAt: new Date(concernedVisit.visitDate.getTime() + 3 * 60 * 60 * 1000),
      clearedNote: "Family visited in person and confirmed things were okay, just tired.",
    });
  }
  for (const esc of toCreate) await Escalation.create(esc);
  console.log(`Created ${toCreate.length} past (Cleared) escalation(s).`);

  console.log("\nDone.");
  console.log(`  Elder: ${elder.name}  (elderId: ${elder._id})`);
  console.log("  This is the elder you registered yourself, so it'll show up on your dashboard as normal.");
  console.log("\nNote: today's visit (if today falls on a scheduled day) was seeded as Fine, and both");
  console.log("escalations are already Cleared — running 'Run Escalation Check' won't fire a new live");
  console.log("email for this elder unless something about today's real schedule changes that.");
  console.log(`\nTo remove just the added visits/escalations: node scripts/backfill-elder-history.mjs "${elder.name}" --clean`);
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
  console.error("Backfill script failed:", err);
  process.exit(1);
});
