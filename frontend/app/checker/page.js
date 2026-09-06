"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/apiClient";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI";
import { formatAddress } from "@/lib/address";

const STORAGE_KEY = "shongeachi_checker_id";

// ---------------------------------------------------------------------
// NOTE: there is no checker login/session system in this project yet
// (checkers have a passwordHash from signup, but no authenticate route).
// Until that exists, this page asks the checker to enter their Checker ID
// once and remembers it in this browser via localStorage — the same
// caller-supplied-id trust model the backend routes already use. Swap
// this gate out for a real login flow once one exists; nothing else on
// this page needs to change, since the backend already checks the
// assignment relationship server-side regardless of how checkerId got here.
// ---------------------------------------------------------------------
function CheckerIdGate({ onSubmit }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) {
      setError("Enter your Checker ID.");
      return;
    }
    try {
      // Confirms the id actually belongs to a real, approved checker
      // before saving it, so we don't send someone into a page full of
      // 403s.
      await api.get(`/api/checkers/${value.trim()}`);
      localStorage.setItem(STORAGE_KEY, value.trim());
      onSubmit(value.trim());
    } catch (err) {
      setError(err.message || "That Checker ID couldn't be verified.");
    }
  }

  return (
    <main className="checkerMain">
      <div style={{ maxWidth: 420, margin: "60px auto" }}>
        <Card>
          <strong>Checker sign-in</strong>
          <p className="muted" style={{ marginBottom: 16 }}>
            Enter your Checker ID to view and update the elders assigned to you.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="fieldGroup">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Checker ID"
              />
            </div>
            <ErrorMessage message={error} />
            <button type="submit" className="submitButton" style={{ marginTop: 12 }}>
              Continue
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}

const initials = (name) =>
  name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();

// Faithful port of the feature branch's checker dashboard: stats grid,
// assigned-elder list with an AI-driven concern badge (Elder.concernStatus
// — set automatically by lib/concernAi.js whenever a visit is logged, no
// manual point assignment involved), and links out to logging a visit or
// messaging the family. The old "Update concern score" manual override
// form is intentionally gone — scoring is fully automatic now.
export default function CheckerDashboard() {
  const [checkerId, setCheckerId] = useState(null);
  const [checker, setChecker] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCheckerId(saved);
  }, []);

  useEffect(() => {
    if (!checkerId) return;
    api
      .get(`/api/checkers/${checkerId}`)
      .then((body) => setChecker(body.data))
      .catch((err) => setError(err.message));
  }, [checkerId]);

  if (!checkerId) return <CheckerIdGate onSubmit={setCheckerId} />;
  if (!checker) return <main className="checkerMain">{error ? <ErrorMessage message={error} /> : "Loading…"}</main>;

  const p = checker.performance || {};
  const assignedElders = checker.assignedElders || [];

  return (
    <main className="checkerMain">
      <p className="eyebrow">Welcome, {checker.checker?.name}</p>
      <ErrorMessage message={error} />

      <section className="stats">
        <Card className="stat"><span>Visits this month</span><strong>{p.visitsThisMonth ?? "—"}</strong></Card>
        <Card className="stat warn"><span>Concern flags raised</span><strong>{p.concernFlags ?? "—"}</strong></Card>
        <Card className="stat"><span>On-time rate</span><strong>{p.onTimeRate?.toFixed?.(1) ?? p.onTimeRate ?? "—"}%</strong></Card>
      </section>

      <Card>
        <strong>Your Assigned Elders ({assignedElders.length})</strong>
        {assignedElders.map((elder) => (
          <div className="elderItem" key={elder._id}>
            <div className="person">
              <span className="avatar">{initials(elder.name)}</span>
              <div>
                <strong>{elder.name}</strong>
                <p className="muted">
                  {elder.visitSchedule?.days?.length || 0}× / week · {formatAddress(elder.address)}
                </p>
              </div>
            </div>
            <div className="person" style={{ gap: 14 }}>
              <Badge tone={elder.concernStatus === "Concern flagged" ? "concern" : ""}>
                {elder.concernStatus || "Fine"}
              </Badge>
              <Link href={`/checker/elders/${elder._id}/log-visit`} className="pillButton">Log Visit</Link>
              <Link href={`/checker/messages/${elder._id}`} className="pillButton">Message</Link>
            </div>
          </div>
        ))}
        {!assignedElders.length && <p className="empty">No elders currently assigned.</p>}
      </Card>
    </main>
  );
}
