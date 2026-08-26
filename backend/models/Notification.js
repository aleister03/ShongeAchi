import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  familyMemberId: { type: String, required: true },
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  elderName: { type: String, required: true },
  escalationId: { type: mongoose.Schema.Types.ObjectId, ref: "Escalation", default: null },
  triggerType: { type: String, default: "" },
  severity: { type: String, default: "" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  // One notification event, fanned out across channels — the "multi" in
  // multi-channel. Each channel records its own delivery status
  // independently, so an email failure never blocks the in-app alert.
  channels: [
    {
      channel: { type: String, enum: ["in-app", "email"], required: true },
      status: { type: String, enum: ["sent", "simulated", "failed"], required: true },
      to: { type: String, default: "" },
      subject: { type: String, default: "" },
      body: { type: String, default: "" },
      sentAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);