export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // Guards against Next.js dev-mode hot reloads calling register() more
  // than once, which would otherwise stack up duplicate timers.
  if (globalThis.__escalationSweepStarted) return;
  globalThis.__escalationSweepStarted = true;

  const { runEscalationSweep } = await import("./lib/escalationSweep.js");

  const INTERVAL_MS = 5 * 60 * 1000; // every 5 minutes — frequent enough that
  // a 2-hour escalation window fires within 5 minutes of its real deadline.

  async function sweep() {
    try {
      const result = await runEscalationSweep();
      if (result.newEscalations > 0) {
        console.log(`[escalation sweep] ${result.newEscalations} new escalation(s) created.`);
      }
    } catch (err) {
      console.error("[escalation sweep] failed:", err);
    }
  }

  sweep(); // run once immediately on boot — don't wait 5 minutes after a restart
  setInterval(sweep, INTERVAL_MS);

  console.log("[escalation sweep] background timer started (every 5 minutes).");
}