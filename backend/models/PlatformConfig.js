import mongoose from "mongoose";
const PlatformConfigSchema = new mongoose.Schema({
  _id: { type: String, default: "platform-config-singleton" },

  defaultEscalateAfterHours: { type: Number, default: 4 },
  disasterMode: {
    enabled: { type: Boolean, default: false },
    reducedEscalateAfterHours: { type: Number, default: 1 },
  },

  concernScoreThresholds: {
    elevated: { type: Number, default: 40 },
    critical: { type: Number, default: 70 },
  },

  premiumPricing: {
    monthlyPerElder: { type: Number, default: 800 },
    annualPerElder: { type: Number, default: 8000 },
  },

  supportedServiceAreas: {
    type: [String],
    default: ["Dhanmondi", "Mirpur", "Uttara", "Gulshan", "Banani", "Adabor", "Mohammadpur", "Bashundhara"],
  },

  notificationRules: {
    escalationNotificationsEnabled: { type: Boolean, default: true },
  },

  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "system" }, 
});

export default mongoose.models.PlatformConfig || mongoose.model("PlatformConfig", PlatformConfigSchema);