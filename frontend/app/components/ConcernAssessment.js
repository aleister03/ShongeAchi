"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiRequest } from "@/app/lib/api";
import { Badge, Card, ErrorMessage, TrendGraph } from "@/app/components/ui/AdminUI";

// AI-Powered Concern Metrics — the historical, multi-visit trend assessment backed
// by the AiAssessment model. Distinct from the per-visit reports: this judges the
// elder's trajectory across their whole visit history.
//
// Lives in its own file so the checker's "visit logged" screen can reuse the same
// headline markup instead of duplicating it. Only classes from styles/dashboard.css
// are used, since the admin and family layouts load that stylesheet alone.

const LEVEL_TONES = { Low: "", Moderate: "concern", High: "warn", Critical: "danger" };

export function concernTone(level) {
  return LEVEL_TONES[level] ?? "";
}

const FACTOR_LABELS = {
  moodLevel: "mood",
  mobilityLevel: "mobility",
  appetiteLevel: "appetite",
  engagementLevel: "engagement"
};

function plural(count, word) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

function signed(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

// Headline: concern level, score, trend and what it was based on. Shared between the
// wellbeing page and the checker's post-visit screen.
export function ConcernHeadline({ assessment }) {
  const { concernLevel, aiConcernScore, aiTrend, visitsAnalyzed, reportsAnalyzed } = assessment;
  const level = concernLevel || "Low";

  return (
    <p style={{ marginTop: 10 }}>
      <Badge tone={concernTone(level)}>{level} concern</Badge>{" "}
      <Badge tone={aiTrend === "Declining" ? "concern" : ""}>{aiTrend}</Badge>{" "}
      <strong>{aiConcernScore}</strong> / 100
      <span className="muted">
        {" · "}from {plural(visitsAnalyzed, "visit")}
        {reportsAnalyzed ? ` and ${plural(reportsAnalyzed, "report")}` : ""}
      </span>
    </p>
  );
}

// Explains how the assessment was produced. A deterministic fallback is labelled as
// such rather than presented as model output.
function MethodNote({ assessment }) {
  const { source, dataSufficiency, fallbackReason, visitsAnalyzed } = assessment;

  if (dataSufficiency === "limited") {
    return (
      <p className="muted">
        Based on only {plural(visitsAnalyzed, "visit")} — not yet enough history for a trend.
        Shown for reference; it does not set this elder&apos;s concern flag.
      </p>
    );
  }
  if (source === "fallback") {
    return (
      <p className="muted">
        Rules-based assessment{fallbackReason ? ` — ${fallbackReason}` : ""}. Trends are computed
        from the visit history directly rather than by the AI model.
      </p>
    );
  }
  return <p className="muted">AI trend analysis across the full visit history.</p>;
}

function SignalRow({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="elderItem">
      <span className="muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

// Shift rows read e.g. "Worsening · 0% → 100% of visits". A null rate means there
// wasn't a distinct before-and-after window to compare.
function shiftValue(shift) {
  if (!shift || shift.direction === "Unknown" || shift.recentRate === null) return null;
  return `${shift.direction} · ${shift.earlierRate}% → ${shift.recentRate}% of visits`;
}

// The evidence behind the score. Collapsed by default — <details> is already used
// elsewhere in the app (components/Navbar.js) so the interaction is consistent.
export function ConcernSignals({ signals }) {
  if (!signals || !signals.windowComparison) return null;

  const { windowComparison: window, attendance, adherence, streaks, wellbeingSlope,
    moodShift, mobilityShift, appetiteShift, engagementShift,
    followUpsRequested, latestVisit, recentObservations, visitsAnalyzed } = signals;

  const concernShift = window.delta === null
    ? null
    : `${window.earlierScore} → ${window.recentScore} (${signed(window.delta)}) · last ${window.recentCount} vs previous ${window.earlierCount}`;

  const wellbeingShift = wellbeingSlope?.delta === null || !wellbeingSlope
    ? null
    : `${wellbeingSlope.earlierAverage} → ${wellbeingSlope.recentAverage} (${signed(wellbeingSlope.delta)})`;

  const medication = adherence?.missedDoseVisits || adherence?.partialDoseVisits
    ? "Missed on " + [
        adherence.missedDoseVisits ? `${adherence.missedDoseVisits}` : null,
        adherence.partialDoseVisits ? `partial on ${adherence.partialDoseVisits}` : null
      ].filter(Boolean).join(", ") + ` of ${plural(visitsAnalyzed, "visit")}`
    : "Taken as prescribed at every visit";

  // A run of one isn't a run, so only surface a streak from two consecutive visits.
  const streak = streaks?.longestConcernStreak >= 2
    ? `${plural(streaks.longestConcernStreak, "consecutive visit")}${streaks.streakIsOngoing ? " (ongoing)" : " (resolved)"}`
    : null;

  const lastVisit = latestVisit?.present
    ? [
        attendance?.daysSinceLastVisit === null ? null
          : attendance.daysSinceLastVisit === 0 ? "today" : `${plural(attendance.daysSinceLastVisit, "day")} ago`,
        latestVisit.status,
        latestVisit.degradedFactors?.length
          ? `${latestVisit.degradedFactors.map((f) => FACTOR_LABELS[f] || f).join(", ")} below normal`
          : null
      ].filter(Boolean).join(" · ")
    : null;

  return (
    <details>
      <summary className="disclosure">Signals behind this score</summary>

      <SignalRow label="Concern score, recent vs earlier" value={concernShift} />
      <SignalRow label="Per-visit wellbeing score" value={wellbeingShift} />
      <SignalRow label="Mood" value={shiftValue(moodShift)} />
      <SignalRow label="Mobility" value={shiftValue(mobilityShift)} />
      <SignalRow label="Appetite" value={shiftValue(appetiteShift)} />
      <SignalRow label="Engagement" value={shiftValue(engagementShift)} />
      <SignalRow label="Medication" value={medication} />
      <SignalRow
        label="Unanswered visits"
        value={attendance ? `${attendance.missedVisits} of ${visitsAnalyzed}${attendance.missedVisitRate ? ` (${attendance.missedVisitRate}%)` : ""}` : null}
      />
      <SignalRow label="Concerned run" value={streak} />
      <SignalRow label="Follow-ups requested" value={followUpsRequested || null} />
      <SignalRow label="Last visit" value={lastVisit} />

      {recentObservations?.length > 0 && (
        <>
          <p className="muted" style={{ marginTop: 14 }}>Checker observations from recent visits</p>
          <ul>
            {recentObservations.map((observation, i) => (
              <li key={i} className="muted">{observation}</li>
            ))}
          </ul>
        </>
      )}
    </details>
  );
}

// Presentational half of the card, kept separate from data fetching so every state
// (loading, empty, AI, fallback, limited history, legacy row) can be rendered and
// verified directly from a payload.
export function ConcernAssessmentView({ data, error, canRecompute, recomputing, onRecompute }) {
  if (!data) return <Card>{error ? <ErrorMessage message={error} /> : <p>Loading…</p>}</Card>;

  const { latest, history = [], message } = data;

  return (
    <Card>
      <div className="elderItem">
        <strong>Concern Assessment</strong>
        {canRecompute && (
          <button className="pillButton" onClick={onRecompute} disabled={recomputing}>
            {recomputing ? "Assessing…" : "Recompute"}
          </button>
        )}
      </div>
      <ErrorMessage message={error} />

      {!latest && <p className="empty">{message}</p>}

      {latest && (
        <>
          <ConcernHeadline assessment={latest} />
          <MethodNote assessment={latest} />

          <p>{latest.reasoning}</p>

          {latest.recommendedAction && (
            <p><strong>Next step:</strong> {latest.recommendedAction}</p>
          )}

          {latest.flaggedPatterns?.length > 0 && (
            <ul>
              {latest.flaggedPatterns.map((pattern, i) => <li key={i} className="muted">{pattern}</li>)}
            </ul>
          )}

          {latest.scoresDiverge && (
            <p className="muted">
              Note: this differs notably from the rules-based score ({latest.deterministicScoreAtRun}/100) — worth a second look.
            </p>
          )}

          <ConcernSignals signals={latest.signals} />

          {history.length >= 2 && (
            <>
              <p className="muted" style={{ marginTop: 14 }}>
                Concern score over the last {history.length} assessments — higher means more
                concerning. The dashed line is the rules-based score for comparison.
              </p>
              <TrendGraph
                series={[
                  { values: history.map((point) => point.aiConcernScore) },
                  { values: history.map((point) => point.deterministicScore), faint: true }
                ]}
              />
            </>
          )}
        </>
      )}
    </Card>
  );
}

// Shown in place of the card when the elder is on the Free plan. Uses the same Card
// and badge vocabulary as the rest of the report, so it reads as a locked section
// rather than a broken one.
export function PremiumUpsell({ message }) {
  return (
    <Card>
      <div className="elderItem">
        <strong>Concern Assessment</strong>
        <Badge tone="concern">Premium</Badge>
      </div>
      <p className="muted">{message}</p>
      <Link href="/family" className="pillButton" style={{ marginTop: 12 }}>Upgrade this elder</Link>
    </Card>
  );
}

export default function ConcernAssessmentCard({ elderId, canRecompute }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  // 402 means the elder is on the Free plan. That isn't a failure, so it gets an
  // upgrade prompt rather than a red error message.
  const [premiumRequired, setPremiumRequired] = useState("");
  const [recomputing, setRecomputing] = useState(false);

  const load = useCallback(() => {
    apiRequest(`/api/wellbeing/${elderId}/ai-assessment`)
      .then((body) => { setData(body.data); setPremiumRequired(""); })
      .catch((err) => {
        if (err.status === 402) setPremiumRequired(err.message);
        else setError(err.message);
      });
  }, [elderId]);

  useEffect(() => { load(); }, [load]);

  const recompute = () => {
    setRecomputing(true);
    setError("");
    apiRequest(`/api/wellbeing/${elderId}/ai-assessment`, { method: "POST" })
      .then(load)
      .catch((err) => setError(err.message))
      .finally(() => setRecomputing(false));
  };

  if (premiumRequired) return <PremiumUpsell message={premiumRequired} />;

  return (
    <ConcernAssessmentView
      data={data}
      error={error}
      canRecompute={canRecompute}
      recomputing={recomputing}
      onRecompute={recompute}
    />
  );
}
