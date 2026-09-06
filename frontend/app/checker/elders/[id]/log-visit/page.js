"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { Card, Badge, ErrorMessage } from "@/app/components/ui/AdminUI";
import { ConcernHeadline } from "@/app/components/ConcernAssessment";
import { formatAddress } from "@/lib/address";
import { VISIT_QUESTIONS } from "@/lib/visitQuestions";

// Faithful port of the feature branch's log-visit screen: pill-button
// choices, a category-completion stepper, and — after submitting — an
// inline result screen (no redirect) that polls for the AI-generated
// report and updated concern assessment rather than sending the checker
// away before they see either.
//
// CHANGED from an earlier version of this page: every question is
// required regardless of visit status, matching the feature branch
// exactly (no "No Answer" shortcut) — a checker who couldn't reach the
// elder still answers based on whatever they could observe or knew from
// context, rather than skipping the interview outright.

const STORAGE_KEY = "shongeachi_checker_id";
const CATEGORIES = [...new Set(VISIT_QUESTIONS.map((q) => q.category))];

export default function LogVisitPage() {
  const { id } = useParams();
  const router = useRouter();
  const [checkerId, setCheckerId] = useState(null);
  const [elder, setElder] = useState(null);
  const [status, setStatus] = useState("Fine");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/checker");
      return;
    }
    setCheckerId(saved);
  }, [router]);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/elders/${id}`).then((res) => setElder(res.data)).catch(() => {});
  }, [id]);

  function setAnswer(qid, field, value) {
    setAnswers((prev) => ({ ...prev, [qid]: { ...prev[qid], [field]: value } }));
  }

  function categoryComplete(category) {
    return VISIT_QUESTIONS.filter((q) => q.category === category).every((q) => !!answers[q.id]?.answer);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const responses = VISIT_QUESTIONS.map((q) => ({
      questionId: q.id,
      answer: answers[q.id]?.answer || "",
      detail: answers[q.id]?.detail || "",
    }));
    if (responses.some((r) => !r.answer)) {
      setError("Please answer every question.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const body = await api.post(`/api/wellbeing/${id}/visits`, { checkerId, status, responses });
      // The visit is saved and the screen appears straight away; the
      // report and assessment arrive shortly after via the poll below.
      setResult(body.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // POST /visits returns as soon as the visit is stored and generates the
  // report (and refreshes the concern assessment) in the background, so
  // the checker isn't left staring at a spinner for the 10-40s two Gemini
  // calls can take. This polls until the report flips out of `pending`.
  useEffect(() => {
    if (!result?.pending || !result?.visit?._id) return undefined;

    let cancelled = false;
    let attempts = 0;
    const timer = setInterval(async () => {
      attempts += 1;
      // ~2 minutes at 2s, comfortably past the Gemini timeout plus retries.
      if (attempts > 60) {
        clearInterval(timer);
        return;
      }
      try {
        const body = await api.get(`/api/wellbeing/${id}/visits/${result.visit._id}/report?checkerId=${checkerId}`);
        if (cancelled) return;
        if (!body.data.pending) {
          clearInterval(timer);
          setResult((current) => ({ ...current, ...body.data, pending: false }));
        }
      } catch {
        // Transient failure (server restarting mid-poll); the next tick retries.
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [result?.pending, result?.visit?._id, id, checkerId]);

  if (!checkerId) return null;

  if (result) {
    const report = result.report;
    const assessment = result.aiAssessment;
    return (
      <main className="checkerMain">
        <p className="eyebrow">Log Visit{elder ? ` · ${elder.name}` : ""}</p>
        <Card>
          <strong>Visit Logged</strong>
          {result.pending ? (
            <p className="muted">Visit saved. Generating the wellbeing report…</p>
          ) : report?.generationFailed || !report ? (
            <p className="muted">Report generation failed for this visit — the visit was still saved.</p>
          ) : (
            <div className="resultHero">
              <div className="resultScore">
                {report.wellbeingScore}
                <small> / 100</small>
              </div>
              <div>
                <Badge tone={report.trendDirection === "Declining" ? "concern" : ""}>{report.trendDirection}</Badge>
                <p className="muted">{report.summary}</p>
              </div>
            </div>
          )}
          {report?.flags?.length > 0 && (
            <ul>
              {report.flags.map((f) => (
                <li key={f} className="muted">{f}</li>
              ))}
            </ul>
          )}
          <Link href="/checker" className="pillButton">Back to Dashboard</Link>
        </Card>

        {assessment && (
          <Card>
            <strong>Concern Assessment (updated)</strong>
            <ConcernHeadline assessment={assessment} />
            <p className="muted">{assessment.reasoning}</p>
            {assessment.recommendedAction && (
              <p className="muted">
                <strong>Next step:</strong> {assessment.recommendedAction}
              </p>
            )}
          </Card>
        )}
      </main>
    );
  }

  const answeredCount = VISIT_QUESTIONS.filter((q) => !!answers[q.id]?.answer).length;

  return (
    <main className="checkerMain">
      <p className="eyebrow">Log Visit{elder ? ` · ${elder.name}` : ""}</p>
      {elder && <p className="muted" style={{ marginBottom: 20 }}>{formatAddress(elder.address)}</p>}
      <ErrorMessage message={error} />

      <div className="formStepper">
        {CATEGORIES.map((category) => (
          <span key={category} className={`formStep ${categoryComplete(category) ? "active" : ""}`}>
            {category}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="fieldGroup">
            <label>Overall status</label>
            <div className="pillChoices">
              {["Fine", "Concerned", "No Answer"].map((s) => (
                <button
                  type="button"
                  key={s}
                  className={`pillChoice ${status === s ? "selected" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {CATEGORIES.map((category) => (
          <Card key={category}>
            <strong>{category}</strong>
            {VISIT_QUESTIONS.filter((q) => q.category === category).map((q) => (
              <div key={q.id} className="fieldGroup">
                <label>{q.prompt}</label>
                {q.type === "choice" ? (
                  <div className="pillChoices">
                    {q.options.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        className={`pillChoice ${answers[q.id]?.answer === opt ? "selected" : ""}`}
                        onClick={() => setAnswer(q.id, "answer", opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[q.id]?.answer || ""}
                    onChange={(e) => setAnswer(q.id, "answer", e.target.value)}
                  />
                )}
                {q.detail && answers[q.id]?.answer === "Yes" && (
                  <input
                    placeholder="Briefly describe…"
                    value={answers[q.id]?.detail || ""}
                    onChange={(e) => setAnswer(q.id, "detail", e.target.value)}
                  />
                )}
              </div>
            ))}
          </Card>
        ))}

        <div className="submitBar">
          <button disabled={loading} className="submitButton" type="submit">
            {loading ? "Submitting…" : `Submit Visit (${answeredCount}/${VISIT_QUESTIONS.length} answered)`}
          </button>
        </div>
      </form>
    </main>
  );
}
