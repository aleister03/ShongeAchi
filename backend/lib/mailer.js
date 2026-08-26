// backend/lib/mailer.js
//
// Transactional email via Brevo (formerly Sendinblue) HTTP API.
// Replaces the previous Nodemailer/Gmail SMTP transport. Keeps the exact
// same exported function signature as before — sendEmail({ to, subject, body })
// — so every existing caller (lib/notifyFamily.js's missed-check-in alerts,
// the elder-registration email below, future weekly-summary/receipt emails)
// needs no changes at all.
//
// If BREVO_API_KEY / EMAIL_FROM aren't configured, emails are "simulated"
// (logged, not sent) so the rest of the app keeps working end to end.

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function getSenderConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;
  const fromName = process.env.EMAIL_FROM_NAME || "Shonge Achi";
  if (!apiKey || !fromEmail) return null;
  return { apiKey, fromEmail, fromName };
}

export async function sendEmail({ to, subject, body }) {
  if (!to) {
    return { status: "failed", to: "" };
  }

  const config = getSenderConfig();

  if (!config) {
    console.log(`[mailer] Simulated email to ${to}: ${subject}`);
    return { status: "simulated", to };
  }

  try {
    const res = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        sender: { name: config.fromName, email: config.fromEmail },
        to: [{ email: to }],
        subject,
        textContent: body,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[mailer] Brevo failed to send to ${to}: ${res.status} ${errText}`);
      return { status: "failed", to };
    }

    return { status: "sent", to };
  } catch (err) {
    console.error(`[mailer] Failed to send email to ${to}:`, err.message);
    return { status: "failed", to };
  }
}