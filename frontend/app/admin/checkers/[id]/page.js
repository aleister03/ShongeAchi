"use client";
import { use, useCallback, useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, CapacityMeter, Card, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";
const money = new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 });

export default function CheckerDetail({ params }) {
  const { id } = use(params); const [checker, setChecker] = useState(null); const [elders, setElders] = useState([]); const [editing, setEditing] = useState(false); const [error, setError] = useState("");
  const load = useCallback(() => apiRequest(`/api/checkers/${id}`).then((body) => setChecker(body.data)).catch((err) => setError(err.message)), [id]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (!editing) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") setEditing(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [editing]);
  const openEditor = async () => { setError(""); try { const body = await apiRequest("/api/elders?unassigned=true"); setElders(body.data); setEditing(true); } catch (requestError) { setError(requestError.message); } };
  const change = async (elderId, method) => { setError(""); try { await apiRequest(`/api/checkers/${id}/assignments`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ elderId }) }); await load(); if (method === "POST") setElders((items) => items.filter((item) => item._id !== elderId)); } catch (requestError) { setError(requestError.message); } };
  if (!checker) return <main className="checkerMain">{error ? <ErrorMessage message={error}/> : "Loading checker…"}</main>;
  const p = checker.performance;
  return <main className="checkerMain"><p className="eyebrow">Checkers › {checker.name}</p><Card className="detailHero"><div className="detailIdentity"><span className="avatar">{checker.name.split(/\s+/).map((x) => x[0]).slice(0,2).join("")}</span><div><h1>{checker.name}</h1><p>{checker.serviceArea} · {checker.shift} · {checker.experienceYears} years experience</p>{checker.verificationStatus === "verified" && <span className="verified">✓ Verified checker</span>}</div></div><button className="pillButton" onClick={openEditor}>Edit Assignment</button></Card><ErrorMessage message={error}/>
    <div className="detailGrid"><div><Card className="capacityCard"><strong>Capacity</strong><CapacityMeter current={checker.currentWorkload} maximum={checker.maxWorkload} large/><span className="muted">{checker.currentWorkload} of {checker.maxWorkload} elders assigned</span></Card><Card className="performance"><strong>Performance</strong><dl><div><dt>Visits this month</dt><dd>{p.visitsThisMonth}</dd></div><div><dt>On-time rate</dt><dd>{p.onTimeRate.toFixed(1)}%</dd></div><div><dt>Concern flags raised</dt><dd>{p.concernFlagsRaised}</dd></div><div><dt>This period&apos;s earnings</dt><dd>{money.format(p.earnings)}</dd></div></dl></Card></div><Card className="eldersCard"><strong>Assigned elders ({checker.currentWorkload})</strong>{checker.assignedElders.map((elder) => <div className="elderItem" key={elder._id}><div><strong>{elder.name}</strong><p className="muted">{elder.visitSchedule?.days?.length || 0}× / week · {formatAddress(elder.address)}</p></div><Badge tone={elder.concernStatus === "Concern flagged" ? "concern" : ""}>{elder.concernStatus}</Badge></div>)}{!checker.assignedElders.length && <p className="empty">No elders currently assigned.</p>}</Card></div>
    {editing && <div className="modalBackdrop" onClick={() => setEditing(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="assignment-title" onClick={(e) => e.stopPropagation()}><div className="modalTop"><h2 id="assignment-title">Edit Assignment</h2><button aria-label="Close assignment editor" onClick={() => setEditing(false)}>✕</button></div><ErrorMessage message={error}/><h3>Current route</h3>{checker.assignedElders.map((elder) => <div className="assignmentRow" key={elder._id}><span>{elder.name}</span><button className="dangerButton" onClick={() => change(elder._id, "DELETE")}>Unassign</button></div>)}<h3 style={{marginTop:24}}>Available elders</h3>{elders.map((elder) => <div className="assignmentRow" key={elder._id}><span>{elder.name}<small className="muted"> · {formatAddress(elder.address)}</small></span><button className="addButton" onClick={() => change(elder._id, "POST")}>Assign</button></div>)}{!elders.length && <p className="empty">No unassigned elders available.</p>}</section></div>}
  </main>;
}
