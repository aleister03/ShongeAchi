import mongoose from "mongoose";

const ElderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  medicalConditions: { type: [String], default: [] },
  mobilityNotes: { type: String, default: "" },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  familyMemberId: { type: String, required: true },
  visitSchedule: {
    days: { type: [String], default: [] },
    escalateAfterHours: { type: Number, default: 4 }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Elder || mongoose.model("Elder", ElderSchema);