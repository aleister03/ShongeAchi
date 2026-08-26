import Notification from "@/models/Notification";
import { sendEmail } from "@/lib/mailer";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";


export async function notifyFamily(elder, escalation) {
  const message = escalation.reason;
  const subject = `Shonge Achi Alert: ${elder.name} — ${escalation.triggerType}`;
  const body =
    `${message}\n\n` +
    `Severity: ${escalation.severity}\n` +
    `View details: ${FRONTEND_URL}/elder/${elder._id}/wellbeing\n\n` +
    `— This is an automated notification from Shonge Achi.`;

  
  const recipients = [elder.familyMemberEmail, elder.emergencyContact?.email, elder.secondaryContact?.email].filter(
    (email, i, arr) => email && arr.indexOf(email) === i // drop empties and de-dupe
  );

  const emailResults = await Promise.all(recipients.map((to) => sendEmail({ to, subject, body })));

  const emailChannels = emailResults.length
    ? emailResults.map((r) => ({ channel: "email", status: r.status, to: r.to, subject, body, sentAt: new Date() }))
    : [{ channel: "email", status: "failed", to: "", subject, body, sentAt: new Date() }];

  return Notification.create({
    familyMemberId: elder.familyMemberId,
    elderId: elder._id,
    elderName: elder.name,
    escalationId: escalation._id,
    triggerType: escalation.triggerType,
    severity: escalation.severity,
    message,
    channels: [
      { channel: "in-app", status: "sent", to: elder.familyMemberId, body: message, sentAt: new Date() },
      ...emailChannels,
    ],
  });
}