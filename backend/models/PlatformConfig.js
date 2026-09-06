import mongoose from "mongoose";

// Platform Configuration — spec: "Admins configure system-wide settings
// such as escalation timing, notification rules, concern score
// thresholds, subscription pricing, disaster mode, and supported service
// areas without modifying application code."
//
// Implemented as a SINGLE document (a fixed, well-known _id) rather than a
// collection — there is exactly one platform configuration, ever. See
// lib/platformConfig.js for the getPlatformConfig() helper that
// auto-creates this document the first time it's needed.
const PlatformConfigSchema = new mongoose.Schema({
  _id: { type: String, default: "platform-config-singleton" },

  disasterMode: {
    enabled: { type: Boolean, default: false },
    // Ceiling applied to EVERY elder's escalation window while active —
    // the escalation engine takes whichever is tighter, this or the
    // elder's own setting, so disaster mode can only ever shrink the
    // window, never loosen it.
    reducedEscalateAfterHours: { type: Number, default: 1 },
    note: { type: String, default: "" }, // e.g. "Cyclone Remal warning — Dhaka"
  },

  concernScoreThresholds: {
    critical: { type: Number, default: 70 }, // score STRICTLY ABOVE this = Critical
    elevated: { type: Number, default: 40 }, // score AT OR ABOVE this = Elevated
  },

  premiumPricing: {
    monthlyPerElder: { type: Number, default: 800 },
    annualPerElder: { type: Number, default: 8000 },
  },

  notificationRules: {
    escalationNotificationsEnabled: { type: Boolean, default: true },
  },

  defaultEscalateAfterHours: { type: Number, default: 4 }, // used as a default for newly registered elders

  supportedServiceAreas: {
    type: [String],
    default: ["Dhanmondi", "Mirpur", "Uttara", "Gulshan", "Mohammadpur", "Adabor"],
  },

  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.PlatformConfig || mongoose.model("PlatformConfig", PlatformConfigSchema);
