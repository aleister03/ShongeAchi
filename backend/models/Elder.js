import mongoose from "mongoose";

const ElderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  medicalConditions: { type: [String], default: [] },
  mobilityNotes: { type: String, default: "" },
  bio: { type: String, default: "" },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true },
    note: { type: String, default: "" }
  },
  secondaryContact: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    relationship: { type: String, default: "" },
    note: { type: String, default: "" }
  },
  familyMemberId: { type: String, required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  concernStatus: { type: String, enum: ["Fine", "Concern flagged"], default: "Fine" },
  visitSchedule: {
    days: { type: [String], default: [] },
    escalateAfterHours: { type: Number, default: 4 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Elder || mongoose.model("Elder", ElderSchema);
