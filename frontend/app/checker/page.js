// frontend/app/checker/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";

const initials = (name) => name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();

export default function CheckerDashboard() {
  const [checker, setChecker] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user?.checkerId) { setError("No checker record linked to this account."); return; }
    apiRequest(`/api/checkers/${user.checkerId}`)
      .then((body) => setChecker(body.data))
      .catch((err) => setError(err.message));
  }, []);

  if (!checker) return <main className="checkerMain">{error ? <ErrorMessage message={error} /> : "Loading…"}</main>;

  const p = checker.performance || {};

  return (
    <main className="checkerMain">
      <p className="eyebrow">Welcome, {checker.name}</p>
      <ErrorMessage message={error} />

      <section className="stats">
        <Card className="stat"><span>Visits this month</span><strong>{p.visitsThisMonth ?? "—"}</strong></Card>
        <Card className="stat warn"><span>Concern flags raised</span><strong>{p.concernFlagsRaised ?? "—"}</strong></Card>
        <Card className="stat"><span>On-time rate</span><strong>{p.onTimeRate?.toFixed?.(1) ?? "—"}%</strong></Card>
      </section>

      <Card>
        <strong>Your Assigned Elders ({checker.currentWorkload})</strong>
        {checker.assignedElders.map((elder) => (
          <div className="elderItem" key={elder._id}>
            <div className="person">
              <span className="avatar">{initials(elder.name)}</span>
              <div>
                <strong>{elder.name}</strong>
                <p className="muted">{elder.visitSchedule?.days?.length || 0}× / week · {formatAddress(elder.address)}</p>
              </div>
            </div>
            <div className="person" style={{ gap: 14 }}>
              <Badge tone={elder.concernStatus === "Concern flagged" ? "concern" : ""}>{elder.concernStatus}</Badge>
              <Link href={`/checker/elders/${elder._id}/log-visit`} className="pillButton">Log Visit</Link>
            </div>
          </div>
        ))}
        {!checker.assignedElders.length && <p className="empty">No elders currently assigned.</p>}
      </Card>
    </main>
  );
}
