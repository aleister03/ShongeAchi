import mongoose from "mongoose";

// Communication System — one thread per elder between the family and the
// currently assigned checker (spec: "Premium subscribers can communicate
// directly with assigned checkers... regarding appointments, medication
// reminders, or special instructions"). Gated on Elder.subscription being
// active Premium — see lib/subscription.js's isPremium().
//
// checkerId/familyMemberId are denormalized onto every message from the
// elder at send time, so a conversation's participants stay associated
// with the message even if the elder is later reassigned to a different
// checker.
const MessageSchema = new mongoose.Schema({
  elderId: { type: mongoose.Schema.Types.ObjectId, ref: "Elder", required: true },
  checkerId: { type: mongoose.Schema.Types.ObjectId, ref: "Checker", required: true },
  familyMemberId: { type: String, required: true },
  senderRole: { type: String, enum: ["family", "checker"], required: true },
  senderName: { type: String, required: true },
  // Optional — a message can be attachment-only (e.g. a photo with no caption).
  text: { type: String, default: "" },
  // --- NEW: optional image/video attachment. Stored as a base64 data URL
  // directly on the document — same pattern Checker.nidPhoto/profilePhoto
  // already use. Fine at capstone scale, not how you'd do it in
  // production (swap for real object storage + a URL field if this ever
  // needs to scale).
  attachment: {
    kind: { type: String, enum: ["image", "video", null], default: null },
    data: { type: String, default: "" }, // base64 data URL
    mimeType: { type: String, default: "" },
  },
  // ---------------------------------------------------------------------
  createdAt: { type: Date, default: Date.now },
});

MessageSchema.index({ elderId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
