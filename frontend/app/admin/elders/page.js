"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";

const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// The roster behind the "Elders" nav link, which previously 404'd. Deliberately mirrors
// admin/checkers/page.js: same .stats row, same toolbar, same .checkerTable markup.
export default function AdminEldersPage() {
  const [elders, setElders] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    apiRequest("/api/elders")
      .then((body) => setElders(body.data))
      .catch((err) => setError(err.message));
  }, []);

  const visible = useMemo(() => (elders ?? []).filter((elder) => {
    if (query && !`${elder.name} ${formatAddress(elder.address)}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (filter === "unassigned") return !elder.checkerId;
    if (filter === "concern") return elder.concernStatus === "Concern flagged";
    if (filter === "premium") return elder.subscription?.isPremium;
    return true;
  }), [elders, query, filter]);

  if (!elders) {
    return <main className="checkerMain"><h1>Elders</h1>{error ? <ErrorMessage message={error} /> : <p className="subtitle">Loading…</p>}</main>;
  }

  const premium = elders.filter((e) => e.subscription?.isPremium).length;
  const unassigned = elders.filter((e) => !e.checkerId).length;
  const flagged = elders.filter((e) => e.concernStatus === "Concern flagged").length;

  return (
    <main className="checkerMain">
      <h1>Elders</h1>
      <p className="subtitle">Everyone registered on the platform, their checker, and their plan</p>

      <section className="stats">
        <div className="card stat"><span>Total elders</span><strong>{elders.length}</strong></div>
        <div className="card stat"><span>Premium</span><strong>{premium}</strong></div>
        <div className={`card stat ${unassigned ? "warn" : ""}`}><span>Unassigned</span><strong>{unassigned}</strong></div>
        <div className={`card stat ${flagged ? "danger" : ""}`}><span>Concern flagged</span><strong>{flagged}</strong></div>
      </section>

      <div className="toolbar">
        <label className="search">
          <span>⌕</span>
          <input aria-label="Search elder" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search elder by name or address" />
        </label>
        <select className="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All elders</option>
          <option value="unassigned">Unassigned</option>
          <option value="concern">Concern flagged</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      <ErrorMessage message={error} />

      <div className="tableWrap">
        <table className="checkerTable">
          <thead><tr><th>ELDER</th><th>ADDRESS</th><th>CHECKER</th><th>STATUS</th><th>PLAN</th></tr></thead>
          <tbody>
            {visible.map((elder) => (
              <tr
                className="rowLink" tabIndex="0" key={elder._id}
                onClick={() => router.push(`/admin/elders/${elder._id}/wellbeing`)}
                onKeyDown={(event) => { if (event.key === "Enter") router.push(`/admin/elders/${elder._id}/wellbeing`); }}
              >
                <td>
                  <div className="person">
                    <span className="avatar">{initials(elder.name)}</span>
                    <div><strong>{elder.name}</strong><span className="muted">{elder.age} yrs</span></div>
                  </div>
                </td>
                <td>{formatAddress(elder.address)}</td>
                <td>{elder.checkerId ? <span className="muted">Assigned</span> : <Badge tone="concern">Unassigned</Badge>}</td>
                <td><Badge tone={elder.concernStatus === "Concern flagged" ? "concern" : ""}>{elder.concernStatus}</Badge></td>
                <td>{elder.subscription?.isPremium ? <Badge>Premium</Badge> : <Badge tone="">Free</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && !error && <p className="empty">No elders match these filters.</p>}
      </div>
    </main>
  );
}
