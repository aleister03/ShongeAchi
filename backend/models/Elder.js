import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  flatFloor: { type: String, default: "" },
  houseNo: { type: String, default: "" },
  road: { type: String, default: "" },
  areaTahna: { type: String, default: "" },
  city: { type: String, default: "" },
  postalCode: { type: String, default: "" },
  country: { type: String, default: "Bangladesh" },
  // --- NEW: geocoded from the fields above at creation time (see
  // backend/lib/geo.js), used by Intelligent Checker Assignment for real
  // distance-based scoring instead of area/city string matching. Null
  // until successfully geocoded — every consumer must handle that case.
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
  },
  // ---------------------------------------------------------------------
});

// Bangladeshi mobile numbers: 11 digits, starting with one of the listed operator prefixes.
const BD_PHONE_REGEX = /^(017|013|018|019|014)\d{8}$/;

const ElderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 30, max: 120 },
  gender: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    match: [BD_PHONE_REGEX, "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014"],
  },
  address: { type: AddressSchema, required: true },
  bio: { type: String, default: "" },
  medicalConditions: { type: [String], default: [] },
  mobilityNotes: { type: String, default: "" },
  emergencyContact: {
    name: { type: String, required: true },
    phone: {
      type: String,
      required: true,
      match: [BD_PHONE_REGEX, "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014"],
    },
    email: {
      type: String,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
    },
    relationship: { type: String, required: true },
    note: { type: String, default: "" },
  },
  secondaryContact: {
    name: { type: String, default: "" },
    // optional field, so only validate the format when something was actually entered
    phone: {
      type: String,
      default: "",
      validate: {
        validator: (v) => !v || BD_PHONE_REGEX.test(v),
        message: "Phone must be an 11-digit number starting with 017, 013, 018, 019, or 014",
      },
    },
    email: { type: String, default: "" },
    relationship: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  familyMemberId: { type: String, required: true },
  familyMemberEmail: { type: String, default: "" },
  visitSchedule: {
    days: { type: [String], default: [] },
    scheduledTime: { type: String, default: "10:00" }, // "HH:MM", 24-hour — expected visit time on each scheduled day
    escalateAfterHours: { type: Number, default: 4 },
  },
  // --- NEW: added for Checker Management & Intelligent Checker Assignment ---
  assignedCheckerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
  status: { type: String, enum: ["Waiting", "Assigned"], default: "Waiting" },
  // ---------------------------------------------------------------------------
  
  concernOverride: {
    score: { type: Number, min: 0, max: 100, default: null },
    note: { type: String, default: "" },
    setByCheckerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", default: null },
    setAt: { type: Date, default: null },
  },
  // ---------------------------------------------------------------------------
  // CHANGED: replaced the isPremium boolean bridge field with a real
  // subscription object, now that Premium is backed by an actual payment
  // gateway (a local bKash/Nagad/Card sandbox simulator — see
  // lib/payments.js, models/PaymentRecord.js, app/api/payments/*) instead
  // of being manually flipped. Whether an elder currently has Premium
  // access is DERIVED on read from this (see lib/subscription.js's
  // isPremium()) rather than trusted as a flag directly, so an expired
  // period stops granting access the moment it lapses without needing a
  // scheduled job.
  subscription: {
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    status: { type: String, enum: ["inactive", "active", "expired", "cancelled"], default: "inactive" },
    currentPeriodEnd: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    lastPaymentId: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPayment", default: null },
  },
  // ---------------------------------------------------------------------------
  // --- NEW: set automatically by the AI concern assessment (see
  // lib/concernAi.js) whenever it finds a declining trend or a high
  // absolute AI concern score. A simple boolean summary of "does this
  // elder currently need attention" for admin/checker dashboards, distinct
  // from the numeric concernScore/category the wellbeing endpoints compute.
  concernStatus: { type: String, enum: ["Fine", "Concern flagged"], default: "Fine" },
  // ---------------------------------------------------------------------------
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Elder || mongoose.model("Elder", ElderSchema);
