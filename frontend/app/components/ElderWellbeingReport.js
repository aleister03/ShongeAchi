"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";
import { Card, ErrorMessage, TrendGraph } from "@/app/components/ui/AdminUI";
import ConcernAssessmentCard from "@/app/components/ConcernAssessment";

export default function ElderWellbeingReport({ elderId, role }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest(`/api/wellbeing/${elderId}/reports`)
      .then((body) => setData(body.data))
      .catch((err) => setError(err.message));
  }, [elderId]);

  if (!data) return <>{error ? <ErrorMessage message={error} /> : <p>Loading…</p>}</>;

  return (
    <>
      <ErrorMessage message={error} />
      {/* Historical trend assessment across all visits. `canRecompute` gates the
          manual refresh to staff roles — family members view but don't trigger it. */}
      <ConcernAssessmentCard elderId={elderId} canRecompute={role === "admin" || role === "checker"} />
      <Card>
        <strong>Wellbeing Trend</strong>
        <p className="muted">Per-visit wellbeing score — higher is better.</p>
        <TrendGraph
          series={[{ values: data.graph.map((point) => point.score) }]}
          emptyMessage="Not enough reports yet for a trend."
        />
      </Card>
      <Card>
        <strong>Visit Reports</strong>
        {data.reports.map((r) => (
          <div key={r._id} className="elderItem">
            <div>
              <strong>{new Date(r.createdAt).toLocaleDateString()}</strong> — {r.trendDirection}
              <p className="muted">{r.generationFailed ? "Report unavailable for this visit." : r.summary}</p>
            </div>
          </div>
        ))}
        {!data.reports.length && <p className="empty">No visit reports yet.</p>}
      </Card>
    </>
  );
}
