import mongoose from "mongoose";
import Checker from "../models/Checker.js";
import Elder from "../models/Elder.js";
import Payment from "../models/Payment.js";
import Visit from "../models/Visit.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

const checkerSpecs = [
  { name: "Rina Akhter", serviceArea: "Mirpur", workload: 18, experienceYears: 2.5, shift: "8am–3pm" },
  { name: "Obaidul Islam", serviceArea: "Uttara", workload: 8, experienceYears: 1.8, shift: "8am–6pm" },
  { name: "Shariful Haque", serviceArea: "Dhanmondi", workload: 15, experienceYears: 2, shift: "9am–5pm" },
  { name: "Nafisa Rahman", serviceArea: "Adabor", workload: 20, experienceYears: 1.5, shift: "7am–3pm" },
  { name: "Mehedi Hasan", serviceArea: "Dhanmondi", workload: 5, experienceYears: 3, shift: "8am–6pm" }
];

const mehediElders = [
  ["Nurul Islam", "House 14, Road 6", "Concern flagged", ["Sunday", "Tuesday", "Thursday"]],
  ["Momena Khatun", "House 22, Road 4", "Fine", ["Monday"]],
  ["Rokeya Khatun", "House 3, Road 9", "Fine", ["Wednesday"]],
  ["Ishtiaq Hossain", "House 41, Road 2", "Fine", ["Sunday", "Tuesday", "Thursday"]],
  ["Abdul Karim", "House 41, Road 2", "Fine", ["Saturday", "Monday", "Wednesday"]]
];

function elderRecord(name, address, concernStatus, days, checkerId, index) {
  return {
    name, address, concernStatus, checkerId,
    age: 68 + index % 17,
    gender: index % 2 ? "Female" : "Male",
    phone: `0170000${String(index).padStart(4, "0")}`,
    medicalConditions: [], mobilityNotes: "",
    emergencyContact: { name: "Showcase Contact", phone: "01700000000", relationship: "Family" },
    familyMemberId: "checker-showcase-seed",
    visitSchedule: { days, escalateAfterHours: 4 }
  };
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    const prior = await Checker.find({ name: { $in: checkerSpecs.map((item) => item.name) } }).session(session);
    const priorIds = prior.map((checker) => checker._id);
    await Visit.deleteMany({ checkerId: { $in: priorIds } }, { session });
    await Payment.deleteMany({ checkerId: { $in: priorIds } }, { session });
    await Elder.deleteMany({ familyMemberId: "checker-showcase-seed" }, { session });
    await Elder.updateMany({ checkerId: { $in: priorIds } }, { $set: { checkerId: null } }, { session });
    await Checker.deleteMany({ _id: { $in: priorIds } }, { session });

    let elderIndex = 1;
    for (const spec of checkerSpecs) {
      const checker = await Checker.create([{
        name: spec.name, serviceArea: spec.serviceArea, experienceYears: spec.experienceYears,
        shift: spec.shift, maxWorkload: 20, verificationStatus: "verified", active: true
      }], { session }).then(([created]) => created);
      const records = spec.name === "Mehedi Hasan"
        ? mehediElders.map(([name, address, concern, days]) => elderRecord(name, address, concern, days, checker._id, elderIndex++))
        : Array.from({ length: spec.workload }, (_, index) => elderRecord(
          `${spec.serviceArea} Elder ${index + 1}`, `House ${index + 1}, ${spec.serviceArea}`, "Fine",
          ["Sunday", "Tuesday"], checker._id, elderIndex++
        ));
      const elders = await Elder.insertMany(records, { session });
      checker.assignedElders = elders.map((elder) => elder._id);
      await checker.save({ session });

      if (spec.name === "Mehedi Hasan") {
        const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(10, 0, 0, 0);
        const visits = Array.from({ length: 84 }, (_, index) => {
          const scheduledAt = new Date(monthStart.getTime() + index * 60 * 60 * 1000);
          return {
            elderId: elders[index % elders.length]._id, checkerId: checker._id, checkerName: checker.name,
            status: index < 6 ? "Concerned" : "Fine", scheduledAt,
            completedAt: new Date(scheduledAt.getTime() + (index < 2 ? 30 : -10) * 60 * 1000), visitDate: scheduledAt
          };
        });
        await Visit.insertMany(visits, { session });
        await Payment.create([{ checkerId: checker._id, amount: 5040, status: "paid", paidAt: new Date() }], { session });
      }
    }
  });
  console.log("Seeded 5 verified checkers and 66 assigned elders. Mehedi Hasan is at 5/20.");
} finally {
  await session.endSession();
  await mongoose.disconnect();
}
