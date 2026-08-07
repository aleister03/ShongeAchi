"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";
import { Badge, CapacityMeter, Card, ErrorMessage } from "@/app/components/ui/AdminUI";

const initials = (name) => name.split(/\s+/).map((word) => word[0]).slice(0, 2).join("").toUpperCase();

export default function CheckersPage() {
  const [payload, setPayload] = useState({ data: [], summary: {} });
  const [query, setQuery] = useState(""); const [area, setArea] = useState(""); const [available, setAvailable] = useState(false); const [error, setError] = useState("");
  const router = useRouter();
  useEffect(() => { apiRequest("/api/checkers").then(setPayload).catch((err) => setError(err.message)); }, []);
  const areas = [...new Set(payload.data.map((checker) => checker.serviceArea))];
  const visible = useMemo(() => payload.data.filter((checker) => (!query || `${checker.name} ${checker.serviceArea}`.toLowerCase().includes(query.toLowerCase())) && (!area || checker.serviceArea === area) && (!available || checker.currentWorkload < checker.maxWorkload)), [payload, query, area, available]);
  const s = payload.summary;
  return <main className="checkerMain"><h1>Checker management</h1><p className="subtitle">Registered field checkers, service areas, and current workload</p>
    <section className="stats"><Card className="stat"><span>Active checkers</span><strong>{s.activeCheckers ?? "—"}</strong></Card><Card className="stat warn"><span>At full capacity</span><strong>{s.atFullCapacity ?? "—"}</strong></Card><Card className="stat danger"><span>Pending verification</span><strong>{s.pendingVerification ?? "—"}</strong></Card><Card className="stat"><span>Avg. workload</span><strong>{s.averageWorkload?.toFixed(1) ?? "—"} <small>/ {s.averageMaxWorkload?.toFixed(0) ?? "—"}</small></strong></Card></section>
    <div className="toolbar"><label className="search"><span>⌕</span><input aria-label="Search checker" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search checker by name or area"/></label><select className="filter" value={area} onChange={(e) => setArea(e.target.value)}><option value="">All areas</option>{areas.map((item) => <option key={item}>{item}</option>)}</select><button className={`filter ${available ? "selected" : ""}`} onClick={() => setAvailable(!available)}>Available capacity only</button></div>
    <ErrorMessage message={error}/><div className="tableWrap"><table className="checkerTable"><thead><tr><th>CHECKER</th><th>SERVICE AREA</th><th>WORKLOAD</th><th>EXPERIENCE</th><th>STATUS</th><th></th></tr></thead><tbody>{visible.map((checker) => <tr className="rowLink" tabIndex="0" key={checker._id} onClick={() => router.push(`/admin/checkers/${checker._id}`)} onKeyDown={(event) => { if (event.key === "Enter") router.push(`/admin/checkers/${checker._id}`); }}><td><div className="person"><span className="avatar">{initials(checker.name)}</span><div><strong>{checker.name}</strong><span className="muted">{checker.shift}</span></div></div></td><td>{checker.serviceArea}</td><td><CapacityMeter current={checker.currentWorkload} maximum={checker.maxWorkload}/><span className="muted">{checker.currentWorkload} of {checker.maxWorkload} elders assigned</span></td><td>{checker.experienceYears.toFixed(1)} yrs</td><td><Badge tone={checker.verificationStatus}>{checker.verificationStatus}</Badge></td><td>⋮</td></tr>)}</tbody></table>{!visible.length && !error && <p className="empty">No checkers match these filters.</p>}</div>
  </main>;
}
