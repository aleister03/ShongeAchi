"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";
import { Badge, ErrorMessage } from "@/app/components/ui/AdminUI";

const initials = (name) =>
  name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default function AssignmentsPage() {
  const [waiting, setWaiting] = useState([]);
  const [selectedElder, setSelectedElder] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [dismissed, setDismissed] = useState([]); // rejected checker ids, client-side only
  const [loadingList, setLoadingList] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState("");
  const [actioning, setActioning] = useState(null); // checkerId currently being approved

  const loadWaitingList = () => {
    setLoadingList(true);
    apiRequest("/api/elders?unassigned=true")
      .then((body) => setWaiting(body.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingList(false));
  };

  useEffect(() => { loadWaitingList(); }, []);

  const selectElder = (elder) => {
    setSelectedElder(elder);
    setRecommendations([]);
    setDismissed([]);
    setError("");
    setLoadingRecs(true);
    apiRequest(`/api/elders/${elder._id}/recommended-checkers`)
      .then((body) => setRecommendations(body.data.recommendations))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingRecs(false));
  };

  const approve = async (checkerId) => {
    if (!selectedElder) return;
    setError("");
    setActioning(checkerId);
    try {
      await apiRequest(`/api/checkers/${checkerId}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId: selectedElder._id }),
      });
      // Assignment succeeded — elder leaves the waiting list.
      setWaiting((items) => items.filter((e) => e._id !== selectedElder._id));
      setSelectedElder(null);
      setRecommendations([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setActioning(null);
    }
  };

  const reject = (checkerId) => {
    // Rejection only affects this admin's current view — nothing is persisted.
    setDismissed((ids) => [...ids, checkerId]);
  };

  const visibleRecommendations = recommendations.filter(
    (checker) => !dismissed.includes(checker._id)
  );

  return (
    <main className="assignMain">
      <p className="eyebrow">Checkers › Intelligent Checker Assignment</p>
      <h1>Intelligent Checker Assignment</h1>
      <p className="subtitle">
        Elders waiting for a checker, ranked by location, workload, experience, and condition match
      </p>
      <ErrorMessage message={error} />

      <div className="assignGrid">
        <section className="waitingPanel">
          <h2>Waiting for Assignment</h2>
          {loadingList && <p className="empty">Loading…</p>}
          {!loadingList && !waiting.length && <p className="empty">No elders waiting for assignment.</p>}
          {waiting.map((elder) => (
            <button
              key={elder._id}
              className={`elderCard ${selectedElder?._id === elder._id ? "selected" : ""}`}
              onClick={() => selectElder(elder)}
            >
              <span className="avatar">{initials(elder.name)}</span>
              <div>
                <strong>{elder.name}</strong>
                <p className="muted">{elder.address}</p>
                {!!elder.medicalConditions?.length && (
                  <p className="muted">{elder.medicalConditions.join(", ")}</p>
                )}
              </div>
            </button>
          ))}
        </section>

        <section className="recommendPanel">
          {!selectedElder && <p className="empty">Select an elder to see recommended checkers.</p>}

          {selectedElder && (
            <>
              <div className="recommendHeader">
                <div>
                  <strong>{selectedElder.name}</strong>
                  <p className="muted">
                    {selectedElder.address}
                    {!!selectedElder.medicalConditions?.length &&
                      ` · ${selectedElder.medicalConditions.join(", ")}`}
                  </p>
                </div>
                <span className="badge">Recommended Checkers</span>
              </div>

              {loadingRecs && <p className="empty">Finding the best checkers…</p>}
              {!loadingRecs && !visibleRecommendations.length && (
                <p className="empty">No eligible checkers available right now.</p>
              )}

              {visibleRecommendations.map((checker) => (
                <div className="checkerRow" key={checker._id}>
                  <div className="person">
                    <span className="avatar">{initials(checker.name)}</span>
                    <div>
                      <strong>{checker.name}</strong>
                      <p className="muted">
                        {checker.serviceArea} · {checker.experienceYears.toFixed(1)} yrs ·{" "}
                        {checker.currentWorkload}/{checker.maxWorkload} elders
                      </p>
                      <p className="muted">Match score: {checker.matchScore} / 100</p>
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className="approveButton"
                      disabled={actioning === checker._id}
                      onClick={() => approve(checker._id)}
                    >
                      {actioning === checker._id ? "Approving…" : "Approve"}
                    </button>
                    <button className="rejectButton" onClick={() => reject(checker._id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </section>
      </div>
    </main>
  );
}