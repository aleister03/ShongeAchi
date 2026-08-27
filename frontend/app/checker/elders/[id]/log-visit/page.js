// frontend/app/checker/elders/[id]/log-visit/page.js
"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { ConcernHeadline } from "@/app/components/ConcernAssessment.js";
import { formatAddress } from "@/app/lib/address.js";

export const VISIT_QUESTIONS = [
  { id: "q1", category: "Overall condition", prompt: "How does the elder appear to be feeling today compared with their usual condition?",
    type: "choice", options: ["Better than usual", "About the same", "Worse than usual"] },
  { id: "q2", category: "Overall condition", prompt: "Has the elder reported or shown any new physical discomfort or difficulty?",
    type: "choice", options: ["No", "Yes"], detail: true },

  { id: "q3", category: "Daily functioning", prompt: "Has the elder been able to carry out their usual daily activities?",
    type: "choice", options: ["Fully", "Partially", "Not able to"] },
  { id: "q4", category: "Daily functioning", prompt: "Has the elder experienced any noticeable difficulty with movement or independence?",
    type: "choice", options: ["No", "Yes"], detail: true },
  { id: "q4b", category: "Daily functioning", prompt: "Has the elder taken their medication as prescribed?",
    type: "choice", options: ["Yes", "Partially", "No"] }, // added — not in your original list, drop if unwanted

  { id: "q5", category: "Food, sleep, and routine", prompt: "Has the elder been eating and drinking normally?",
    type: "choice", options: ["Yes, normally", "Somewhat reduced", "Poor intake"] },
  { id: "q6", category: "Food, sleep, and routine", prompt: "Has the elder's sleep or daily routine changed noticeably?",
    type: "choice", options: ["No change", "Yes"], detail: true },

  { id: "q7", category: "Emotional wellbeing", prompt: "How does the elder appear emotionally during the visit?",
    type: "choice", options: ["Cheerful / positive", "Neutral / calm", "Withdrawn", "Distressed / anxious"] },
  { id: "q8", category: "Emotional wellbeing", prompt: "Has the elder shown any noticeable change in mood, behavior, communication, or engagement?",
    type: "choice", options: ["No", "Yes"], detail: true },

  { id: "q9", category: "Social and lifestyle", prompt: "Has the elder interacted with family, friends, caregivers, or others since the previous visit?",
    type: "choice", options: ["Yes", "No", "Unknown"], detail: true },
  { id: "q10", category: "Social and lifestyle", prompt: "Has the elder participated in their usual activities or interests?",
    type: "choice", options: ["Yes, as usual", "Less than usual", "Not at all"] },

  { id: "q11", category: "Environment and support", prompt: "Does the elder's living environment appear safe and suitable for their current needs?",
    type: "choice", options: ["Yes", "Some concerns", "No"], detail: true },
  { id: "q12", category: "Environment and support", prompt: "Does the elder appear to have the necessary support and basic necessities?",
    type: "choice", options: ["Yes", "Some gaps", "No"], detail: true },

  { id: "q13", category: "Change detection", prompt: "What is the most noticeable change, if any, since the previous visit?",
    type: "text" },
  { id: "q14", category: "Change detection", prompt: "Did the checker observe anything that may require follow-up or attention?",
    type: "choice", options: ["No", "Yes"], detail: true }
];
const CATEGORIES = [...new Set(VISIT_QUESTIONS.map((q) => q.category))];

export default function LogVisit({ params }) {
  const { id } = use(params);
  const [elder, setElder] = useState(null);
  const [status, setStatus] = useState("Fine");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest(`/api/elders/${id}`).then((body) => setElder(body.data)).catch(() => {});
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
      detail: answers[q.id]?.detail || ""
    }));
    if (responses.some((r) => !r.answer)) { setError("Please answer every question."); return; }

    setError(""); setLoading(true);
    try {
      const body = await apiRequest(`/api/wellbeing/${id}/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, responses })
      });
      setResult(body.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const report = result.report;
    const assessment = result.aiAssessment;
    return (
      <main className="checkerMain">
        <p className="eyebrow">Log Visit{elder ? ` · ${elder.name}` : ""}</p>
        <Card>
          <strong>Visit Logged</strong>
          {report?.generationFailed || !report
            ? <p className="muted">Report generation failed for this visit — the visit was still saved.</p>
            : (
              <div className="resultHero">
                <div className="resultScore">{report.wellbeingScore}<small> / 100</small></div>
                <div>
                  <Badge tone={report.trendDirection === "Declining" ? "concern" : ""}>{report.trendDirection}</Badge>
                  <p className="muted">{report.summary}</p>
                </div>
              </div>
            )}
          {report?.flags?.length > 0 && <ul>{report.flags.map((f) => <li key={f} className="muted">{f}</li>)}</ul>}
          <Link href="/checker" className="pillButton">Back to Dashboard</Link>
        </Card>

        {assessment && (
          <Card>
            <strong>Concern Assessment (updated)</strong>
            <ConcernHeadline assessment={assessment} />
            <p className="muted">{assessment.reasoning}</p>
            {assessment.recommendedAction && (
              <p className="muted"><strong>Next step:</strong> {assessment.recommendedAction}</p>
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
          <span key={category} className={`formStep ${categoryComplete(category) ? "active" : ""}`}>{category}</span>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="fieldGroup">
            <label>Overall status</label>
            <div className="pillChoices">
              {["Fine", "Concerned", "No Answer"].map((s) => (
                <button type="button" key={s} className={`pillChoice ${status === s ? "selected" : ""}`}
                  onClick={() => setStatus(s)}>
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
                      <button type="button" key={opt}
                        className={`pillChoice ${answers[q.id]?.answer === opt ? "selected" : ""}`}
                        onClick={() => setAnswer(q.id, "answer", opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea value={answers[q.id]?.answer || ""} onChange={(e) => setAnswer(q.id, "answer", e.target.value)} />
                )}
                {q.detail && answers[q.id]?.answer === "Yes" && (
                  <input placeholder="Briefly describe…" value={answers[q.id]?.detail || ""}
                    onChange={(e) => setAnswer(q.id, "detail", e.target.value)} />
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