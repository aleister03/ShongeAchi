"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, Card, CapacityMeter, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";

const initials = (name) => name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();

// Matches the tone vocabulary already used by .stat.warn / .stat.danger and the
// concern badges elsewhere in the app.
const LEVEL_TONE = { Critical: "danger", High: "concern", Moderate: "concern", Low: "" };

const money = (amount, currency) =>
  currency === "BDT" ? `৳${amount.toLocaleString("en-BD")}` : `${amount.toLocaleString()}`;

function Stat({ label, value, tone = "", note }) {
  return (
    <Card className={`stat ${tone}`}>
      <span>{label}</span>
      <strong>{value ?? "—"}{note && <small> {note}</small>}</strong>
    </Card>
  );
}

function Panel({ title, hint, link, linkLabel, children }) {
  return (
    <section className="dashPanel">
      <div className="panelTop">
        <h2>{title}</h2>
        {link && <Link href={link}>{linkLabel} →</Link>}
      </div>
      {hint && <p className="hint">{hint}</p>}
      {children}
    </section>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/analytics/overview")
      .then((body) => setData(body.data))
      .catch((err) => setError(err.message));
  }, []);

  return <DashboardView data={data} error={error} />;
}

// Presentational half, kept separate from data fetching so every state (loading,
// error, empty platform, populated, subscriptions wired up) can be rendered and
// verified directly from a payload.
export function DashboardView({ data, error }) {
  const router = useRouter();

  if (error && !data) {
    return <main className="checkerMain"><h1>Dashboard</h1><ErrorMessage message={error} /></main>;
  }
  if (!data) {
    return <main className="checkerMain"><h1>Dashboard</h1><p className="subtitle">Loading platform statistics…</p></main>;
  }

  const { elders, visits, checkers, concern, capacityAlerts, unassignedMatches, payouts, subscriptions } = data;
  const actionable = capacityAlerts.filter((alert) => alert.actionable);
  const uncovered = capacityAlerts.filter((alert) => !alert.actionable);
  const waitingWithMatch = unassignedMatches.filter((item) => item.bestMatch);

  return (
    <main className="checkerMain">
      <h1>Dashboard</h1>
      <p className="subtitle">
        Platform overview · visits and payouts for {new Date(data.period.start).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </p>
      <ErrorMessage message={error} />

      {/* Care delivery */}
      <section className="stats">
        <Stat label="Active elders" value={elders.active} note={`of ${elders.total}`} />
        <Stat label="Completed visits" value={visits.completed} note={visits.completionRate !== null ? `· ${visits.completionRate}%` : undefined} />
        <Stat label="Missed visits" value={visits.missed} tone={visits.missed ? "warn" : ""} note={visits.missedRate !== null ? `· ${visits.missedRate}%` : undefined} />
        <Stat label="Critical / high concern" value={concern.escalated} tone={concern.critical ? "danger" : concern.high ? "warn" : ""} />
      </section>

      {/* Capacity and commercial */}
      <section className="stats">
        <Stat label="Checkers at full capacity" value={checkers.atFullCapacity} tone={checkers.atFullCapacity ? "warn" : ""} note={`of ${checkers.activeCheckers}`} />
        <Stat label="Free assignment slots" value={checkers.availableCapacity} note={checkers.utilizationRate !== null ? `· ${checkers.utilizationRate}% used` : undefined} />
        {subscriptions.available ? (
          <Stat
            label="Premium subscribers"
            value={subscriptions.premiumSubscribers}
            note={subscriptions.conversionRate !== null ? `· ${subscriptions.conversionRate}%` : undefined}
          />
        ) : (
          <Stat label="Premium subscribers" value="Not tracked yet" tone="unavailable" />
        )}
        {subscriptions.available ? (
          <Stat label="Monthly revenue" value={money(subscriptions.monthlyRevenue, subscriptions.currency)} />
        ) : (
          <Stat label="Checker payouts" value={money(payouts.paidThisMonth, payouts.currency)} note="paid" />
        )}
      </section>

      <p className="muted" style={{ marginTop: 4 }}>
        {subscriptions.available
          ? `Revenue is subscription income received this month. Checker payouts (money out) were ${money(payouts.paidThisMonth, payouts.currency)}.`
          : subscriptions.reason}
        {payouts.pendingThisMonth > 0 && ` A further ${money(payouts.pendingThisMonth, payouts.currency)} in payouts is pending.`}
      </p>

      <div className="dashGrid">
        {/* The reassignment signal: full checker beside a nearby colleague with room. */}
        <Panel
          title="Capacity and reassignment"
          hint="Checkers at their maximum workload, with available checkers in the same service area"
          link="/admin/checkers"
          linkLabel="All checkers"
        >
          {!capacityAlerts.length && <p className="empty">No checker is at full capacity.</p>}

          {actionable.map((alert) => (
            <div className="alertRow" key={alert.checker._id}>
              <div className="person">
                <span className="avatar">{initials(alert.checker.name)}</span>
                <div>
                  <strong>{alert.checker.name}</strong>
                  <p className="muted">
                    {alert.checker.serviceArea} · full at {alert.checker.currentWorkload}/{alert.checker.maxWorkload}
                    {alert.checker.overBy > 0 && ` · ${alert.checker.overBy} over`}
                  </p>
                </div>
              </div>
              <span className="arrow" aria-hidden="true">→</span>
              <div className="to">
                <strong>{alert.alternatives[0].name}</strong>
                <p className="muted">
                  {alert.alternatives[0].availableCapacity} slot{alert.alternatives[0].availableCapacity === 1 ? "" : "s"} free
                  {alert.alternatives.length > 1 && ` · +${alert.alternatives.length - 1} more nearby`}
                </p>
                <Link href={`/admin/checkers/${alert.checker._id}`} className="muted">Reassign →</Link>
              </div>
            </div>
          ))}

          {uncovered.map((alert) => (
            <div className="alertRow" key={alert.checker._id}>
              <div className="person">
                <span className="avatar">{initials(alert.checker.name)}</span>
                <div>
                  <strong>{alert.checker.name}</strong>
                  <p className="muted">{alert.checker.serviceArea} · full at {alert.checker.currentWorkload}/{alert.checker.maxWorkload}</p>
                </div>
              </div>
              <Badge tone="concern">No cover in area</Badge>
            </div>
          ))}
        </Panel>

        {/* Elders needing a checker. */}
        <Panel
          title="Waiting for assignment"
          hint={`${elders.unassigned} elder${elders.unassigned === 1 ? "" : "s"} without a checker`}
          link="/admin/assignments"
          linkLabel="Assign"
        >
          {!unassignedMatches.length && <p className="empty">Every elder has a checker assigned.</p>}
          {unassignedMatches.map((item) => (
            <div className="elderItem" key={item.elder._id}>
              <div>
                <strong>{item.elder.name}</strong>
                <p className="muted">{formatAddress(item.elder.address)}</p>
              </div>
              <div className="to">
                {item.bestMatch ? (
                  <>
                    <span className="muted">{item.bestMatch.name}</span>
                    <p className="muted">{item.availableInArea} available in area</p>
                  </>
                ) : (
                  <Badge tone="concern">No checker in area</Badge>
                )}
              </div>
            </div>
          ))}
          {unassignedMatches.length > 0 && waitingWithMatch.length === 0 && (
            <p className="muted">No waiting elder has a matching checker with free capacity.</p>
          )}
        </Panel>
      </div>

      {/* Escalations. */}
      <Panel
        title="Elders needing attention"
        hint={`Highest concern levels from the latest assessment of each elder · ${concern.assessedElders} assessed`}
      >
        {!concern.cases.length && <p className="empty">No elder is currently at high or critical concern.</p>}
        {concern.cases.length > 0 && (
          <div className="tableWrap">
            <table className="checkerTable">
              <thead>
                <tr><th>ELDER</th><th>CONCERN</th><th>SCORE</th><th>TREND</th><th>ASSESSED</th></tr>
              </thead>
              <tbody>
                {concern.cases.map((item) => (
                  <tr
                    className="rowLink"
                    tabIndex="0"
                    key={item.elderId}
                    onClick={() => router.push(`/admin/elders/${item.elderId}/wellbeing`)}
                    onKeyDown={(event) => { if (event.key === "Enter") router.push(`/admin/elders/${item.elderId}/wellbeing`); }}
                  >
                    <td>
                      <div className="person">
                        <span className="avatar">{initials(item.elderName)}</span>
                        <div><strong>{item.elderName}</strong><span className="muted">{formatAddress(item.address)}</span></div>
                      </div>
                    </td>
                    <td><Badge tone={LEVEL_TONE[item.concernLevel] ?? ""}>{item.concernLevel}</Badge></td>
                    <td>
                      <CapacityMeter current={item.concernScore} maximum={100} />
                      <span className="muted">{item.concernScore} / 100</span>
                    </td>
                    <td>{item.trend}</td>
                    <td>
                      {item.assessedAt ? new Date(item.assessedAt).toLocaleDateString() : "—"}
                      {item.source === "fallback" && <span className="muted"> · rules-based</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </main>
  );
}
