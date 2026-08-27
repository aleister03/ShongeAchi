import mongoose from "mongoose";
import Checker from "../models/Checker.js";
import Elder from "../models/Elder.js";
import Payment from "../models/Payment.js";
import Visit from "../models/Visit.js";
import VisitReport from "../models/VisitReport.js";
import User from "../models/User.js";
import { hashPassword } from "../lib/auth.js";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is required");
}

const checkerSpecs = [
  {
    name: "Rina Akhter",
    serviceArea: "Mirpur",
    workload: 18,
    experienceYears: 2.5,
    shift: "8am–3pm"
  },
  {
    name: "Obaidul Islam",
    serviceArea: "Uttara",
    workload: 8,
    experienceYears: 1.8,
    shift: "8am–6pm"
  },
  {
    name: "Shariful Haque",
    serviceArea: "Dhanmondi",
    workload: 15,
    experienceYears: 2,
    shift: "9am–5pm"
  },
  {
    name: "Nafisa Rahman",
    serviceArea: "Adabor",
    workload: 20,
    experienceYears: 1.5,
    shift: "7am–3pm"
  },
  {
    name: "Mehedi Hasan",
    serviceArea: "Dhanmondi",
    workload: 5,
    experienceYears: 3,
    shift: "8am–6pm"
  }
];

const mehediElders = [
  [
    "Nurul Islam",
    "House 14, Road 6",
    "Concern flagged",
    ["Sunday", "Tuesday", "Thursday"]
  ],
  [
    "Momena Khatun",
    "House 22, Road 4",
    "Fine",
    ["Monday"]
  ],
  [
    "Rokeya Khatun",
    "House 3, Road 9",
    "Fine",
    ["Wednesday"]
  ],
  [
    "Ishtiaq Hossain",
    "House 41, Road 2",
    "Fine",
    ["Sunday", "Tuesday", "Thursday"]
  ],
  [
    "Abdul Karim",
    "House 41, Road 2",
    "Fine",
    ["Saturday", "Monday", "Wednesday"]
  ]
];

function elderRecord(
  name,
  address,
  concernStatus,
  days,
  checkerId,
  index
) {
  return {
    name,
    address,
    concernStatus,
    checkerId,

    age: 68 + (index % 17),
    gender: index % 2 ? "Female" : "Male",
    phone: `0170000${String(index).padStart(4, "0")}`,

    medicalConditions: [],
    mobilityNotes: "",

    emergencyContact: {
      name: "Showcase Contact",
      phone: "01700000000",
      relationship: "Family"
    },

    familyMemberId: "checker-showcase-seed",

    visitSchedule: {
      days,
      escalateAfterHours: 4
    }
  };
}

function syntheticResponses(concerning) {
  return [
    { questionId: "q1", answer: concerning ? "Worse than usual" : "About the same" },
    { questionId: "q2", answer: concerning ? "Yes" : "No", detail: concerning ? "Reported joint pain" : "" },
    { questionId: "q3", answer: concerning ? "Partially" : "Fully" },
    { questionId: "q4", answer: concerning ? "Yes" : "No", detail: concerning ? "Needed support walking" : "" },
    { questionId: "q4b", answer: concerning ? "Partially" : "Yes" },
    { questionId: "q5", answer: concerning ? "Somewhat reduced" : "Yes, normally" },
    { questionId: "q6", answer: concerning ? "Yes" : "No change", detail: concerning ? "Sleeping later than usual" : "" },
    { questionId: "q7", answer: concerning ? "Withdrawn" : "Neutral / calm" },
    { questionId: "q8", answer: concerning ? "Yes" : "No", detail: concerning ? "Quieter than usual" : "" },
    { questionId: "q9", answer: "Yes" },
    { questionId: "q10", answer: concerning ? "Less than usual" : "Yes, as usual" },
    { questionId: "q11", answer: "Yes" },
    { questionId: "q12", answer: "Yes" },
    { questionId: "q13", answer: concerning ? "Seemed more tired than the last visit." : "No notable change." },
    { questionId: "q14", answer: concerning ? "Yes" : "No", detail: concerning ? "Worth a follow-up call" : "" }
  ];
}

// Builds the VisitReport row that accompanies a seeded visit. Seeding runs offline
// with no Gemini call, so these stand in for AI-generated reports — the shape matches
// VisitReport exactly, including the wellbeingScore series the concern-trend analysis
// reads (higher is better, the inverse of the concern scale).
function syntheticReport(visit) {
  const concerning = visit.status === "Concerned";
  return {
    visitId: visit._id,
    elderId: visit.elderId,
    wellbeingScore: concerning ? 48 : 82,
    moodAssessment: concerning ? "withdrawn" : "calm and settled",
    trendDirection: concerning ? "Declining" : "Stable",
    flags: concerning ? ["Reduced appetite", "Needed support walking"] : [],
    summary: concerning
      ? "Seemed more tired and withdrawn than usual, with reduced appetite and some difficulty moving around. Worth a follow-up call."
      : "In good spirits and managing daily activities as usual. No concerns noted during this visit.",
    createdAt: visit.visitDate
  };
}

await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
});

const session = await mongoose.startSession();

try {
  await session.withTransaction(async () => {
    /*
     * 1. Find previously seeded checkers
     */
    const priorCheckers = await Checker.find({
      name: {
        $in: checkerSpecs.map((item) => item.name)
      }
    }).session(session);

    const priorCheckerIds = priorCheckers.map(
      (checker) => checker._id
    );

    /*
     * 2. Find elders assigned to those checkers
     */
    const priorElders = await Elder.find({
      checkerId: {
        $in: priorCheckerIds
      }
    }).session(session);

    const priorElderIds = priorElders.map(
      (elder) => elder._id
    );

    /*
     * 3. Clean up old seeded data
     */
    await VisitReport.deleteMany(
      {
        elderId: {
          $in: priorElderIds
        }
      },
      { session }
    );

    await Visit.deleteMany(
      {
        checkerId: {
          $in: priorCheckerIds
        }
      },
      { session }
    );

    await Payment.deleteMany(
      {
        checkerId: {
          $in: priorCheckerIds
        }
      },
      { session }
    );

    await Elder.deleteMany(
      {
        familyMemberId: "checker-showcase-seed"
      },
      { session }
    );

    await Elder.updateMany(
      {
        checkerId: {
          $in: priorCheckerIds
        }
      },
      {
        $set: {
          checkerId: null
        }
      },
      { session }
    );

    await Checker.deleteMany(
      {
        _id: {
          $in: priorCheckerIds
        }
      },
      { session }
    );

    /*
     * 4. Remove old demo accounts
     */
    await User.deleteMany(
      {
        email: {
          $in: [
            "admin@demo.test",
            "checker@demo.test",
            "family@demo.test"
          ]
        }
      },
      { session }
    );

    let elderIndex = 1;

    let mehediChecker = null;
    let familyElders = [];

    /*
     * 5. Create checkers and elders
     */
    for (const spec of checkerSpecs) {
      const [checker] = await Checker.create(
        [
          {
            name: spec.name,
            serviceArea: spec.serviceArea,
            experienceYears: spec.experienceYears,
            shift: spec.shift,

            maxWorkload: 20,
            verificationStatus: "verified",
            active: true
          }
        ],
        { session }
      );

      const records =
        spec.name === "Mehedi Hasan"
          ? mehediElders.map(
              ([name, address, concern, days]) =>
                elderRecord(
                  name,
                  address,
                  concern,
                  days,
                  checker._id,
                  elderIndex++
                )
            )
          : Array.from(
              { length: spec.workload },
              (_, index) =>
                elderRecord(
                  `${spec.serviceArea} Elder ${index + 1}`,
                  `House ${index + 1}, ${spec.serviceArea}`,
                  "Fine",
                  ["Sunday", "Tuesday"],
                  checker._id,
                  elderIndex++
                )
            );

      const elders = await Elder.insertMany(records, {
        session
      });

      checker.assignedElders = elders.map(
        (elder) => elder._id
      );

      await checker.save({ session });

      /*
       * 6. Create Mehedi's demo data
       */
      if (spec.name === "Mehedi Hasan") {
        mehediChecker = checker;
        familyElders = elders;

        const monthStart = new Date();

        monthStart.setDate(1);
        monthStart.setHours(10, 0, 0, 0);

        const visits = Array.from({ length: 84 }, (_, index) => {
        const scheduledAt = new Date(monthStart.getTime() + index * 60 * 60 * 1000);
        const concerning = index < 6;
        return {
          elderId: elders[index % elders.length]._id,
          checkerId: checker._id,
          checkerName: checker.name,
          status: concerning ? "Concerned" : "Fine",
          responses: syntheticResponses(concerning),
          scheduledAt,
          completedAt: new Date(scheduledAt.getTime() + (index < 2 ? 30 : -10) * 60 * 1000),
          visitDate: scheduledAt
        };
      });

        // Insert visits only once
        const insertedVisits = await Visit.insertMany(
          visits,
          { session }
        );

        await VisitReport.insertMany(
          insertedVisits.map(syntheticReport),
          { session }
        );

        await Payment.create(
          [
            {
              checkerId: checker._id,
              amount: 5040,
              status: "paid",
              paidAt: new Date()
            }
          ],
          { session }
        );
      }
    }

    /*
     * 7. Create demo accounts
     */
    const passwordHash = await hashPassword(
      "password123"
    );

    await User.create(
      [
        {
          email: "admin@demo.test",
          passwordHash,
          role: "admin",
          name: "Demo Admin"
        }
      ],
      { session }
    );

    await User.create(
      [
        {
          email: "checker@demo.test",
          passwordHash,
          role: "checker",
          name: mehediChecker.name,
          checkerId: mehediChecker._id
        }
      ],
      { session }
    );

    const [familyUser] = await User.create(
      [
        {
          email: "family@demo.test",
          passwordHash,
          role: "family",
          name: "Demo Family"
        }
      ],
      { session }
    );

    familyUser.familyMemberId = familyUser._id.toString();
    await familyUser.save({ session });

    await Elder.updateMany(
      {
        _id: {
          $in: familyElders.map(
            (elder) => elder._id
          )
        }
      },
      {
        $set: {
          familyMemberId:
            familyUser._id.toString()
        }
      },
      { session }
    );
  });

  console.log(`
Seed completed successfully.

Checkers: 5
Elders: 66
Demo accounts: 3

Admin:
admin@demo.test

Checker:
checker@demo.test

Family:
family@demo.test

Password:
password123
  `);
} finally {
  await session.endSession();
  await mongoose.disconnect();
}