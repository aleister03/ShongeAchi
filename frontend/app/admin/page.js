"use client";
import { Fragment, useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { api } from "@/lib/apiClient";

const CATEGORY_STYLES = {
  Critical: { pill: "bg-red-100 text-red-600", dot: "text-red-500" },
  Elevated: { pill: "bg-amber-100 text-amber-600", dot: "text-amber-500" },
  Stable: { pill: "bg-green-100 text-green-700", dot: "text-green-500" },
};

const TABS = [
  { key: "all", label: "All elders" },
  { key: "Critical", label: "Critical" },
  { key: "Elevated", label: "Elevated" },
  { key: "Stable", label: "Stable" },
];

function TrendLabel({ trend }) {
  if (!trend || trend.direction === "stable") {
    return <span className="text-gray-400">stable</span>;
  }
  const color = trend.direction === "up" ? "text-red-500" : "text-green-600";
  return <span className={`font-medium ${color}`}>{trend.label}</span>;
}

/** Expanded detail panel for one elder — fetches that elder's raw visit history on demand. */
function ElderTrendPanel({ elder }) {
  const [visits, setVisits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/api/wellbeing/${elder.elderId}/visits`);
        if (!cancelled) setVisits(res.data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setVisits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [elder.elderId]);

  return (
    <tr className="bg-[#fbfbf6]">
      <td colSpan={5} className="px-6 py-5 border-t border-gray-100">
        <div className="flex flex-wrap gap-8">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Why this score</p>
            <ul className="text-sm text-gray-700 list-disc list-inside">
              {elder.contributingFactors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="flex-1 min-w-[280px]">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Recent visits (last {visits ? Math.min(visits.length, 6) : "..."})
            </p>
            {loading ? (
              <p className="text-sm text-gray-400">Loading visit history…</p>
            ) : visits.length === 0 ? (
              <p className="text-sm text-gray-400">No visits recorded yet.</p>
            ) : (
              <div className="grid grid-cols-1 gap-1.5">
                {visits.slice(0, 6).map((v) => (
                  <div key={v._id} className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="w-20 text-gray-400">
                      {new Date(v.visitDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        v.status === "Concerned"
                          ? "bg-red-100 text-red-600"
                          : v.status === "No Answer"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {v.status}
                    </span>
                    <span>Appetite: {v.appetiteLevel}</span>
                    <span>Mobility: {v.mobilityLevel}</span>
                    <span>Meds: {v.medicationTaken ? "Taken" : "Missed"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const [escalations, setEscalations] = useState([]);
  const [escalationsLoading, setEscalationsLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);
  const [lastRunResult, setLastRunResult] = useState(null);
  // --- NEW: Platform Configuration — disaster mode banner ---
  const [disasterModeActive, setDisasterModeActive] = useState(false);
  // ------------------------------------------------------------

  useEffect(() => {
    load();
    loadEscalations();
    api
      .get("/api/platform-config")
      .then((res) => setDisasterModeActive(!!res.data.disasterMode?.enabled))
      .catch(() => {});
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/api/wellbeing/dashboard");
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadEscalations() {
    setEscalationsLoading(true);
    try {
      const res = await api.get("/api/escalations?status=Open");
      setEscalations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setEscalationsLoading(false);
    }
  }

  async function runEscalationCheck() {
    setRunningCheck(true);
    setLastRunResult(null);
    try {
      const res = await api.post("/api/escalations", {});
      setLastRunResult(res.data);
      setDisasterModeActive(!!res.data.disasterModeActive);
      loadEscalations();
    } catch (err) {
      console.error(err);
      setLastRunResult({ error: err.message || "Escalation check failed." });
    } finally {
      setRunningCheck(false);
    }
  }

  // apiClient.js only exposes get/post/put/del, and clearing an escalation
  // is a PATCH — same workaround the checker concern-score page already
  // uses for its PATCH call, rather than editing the shared client.
  async function clearEscalation(id) {
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1078";
    try {
      const res = await fetch(`${API_URL}/api/escalations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to clear escalation.");
      loadEscalations();
    } catch (err) {
      console.error(err);
    }
  }

  const elders = data?.elders || [];
  const filtered = activeTab === "all" ? elders : elders.filter((e) => e.category === activeTab);

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10">
        {/* --- NEW: Disaster Mode banner, driven by Platform Configuration --- */}
        {disasterModeActive && (
          <div className="mb-6 bg-red-500 text-white rounded-2xl px-6 py-4 flex items-center justify-between">
            <span className="font-semibold">
              ⚠ Disaster Mode is active — every elder&apos;s escalation window is currently tightened platform-wide.
            </span>
            <a href="/admin/platform-config" className="text-sm underline hover:no-underline">
              Manage in Settings
            </a>
          </div>
        )}
        {/* ------------------------------------------------------------------- */}

        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-1">AI concern metrics</h1>
        <p className="text-gray-500 mb-8">
          Every elder&apos;s wellbeing trend, built from visit history rather than a single visit
        </p>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Critical (&gt;70%)</p>
            <p className="text-3xl font-bold text-red-500">{loading ? "…" : data.summary.critical}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Elevated (40-70%)</p>
            <p className="text-3xl font-bold text-amber-500">{loading ? "…" : data.summary.elevated}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Stable (&lt;40%)</p>
            <p className="text-3xl font-bold text-green-600">{loading ? "…" : data.summary.stable}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Trending upward this week</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">{loading ? "…" : data.summary.trendingUpThisWeek}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-[#1a1a1a]">Automated Escalation Engine</h2>
              <p className="text-sm text-gray-500">
                Sweeps every assigned elder for missed, overdue, or concerning visits and opens an escalation automatically
              </p>
            </div>
            <button
              onClick={runEscalationCheck}
              disabled={runningCheck}
              className="px-6 py-2.5 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#215f49] transition disabled:opacity-50"
            >
              {runningCheck ? "Running check…" : "Run Escalation Check"}
            </button>
          </div>

          {lastRunResult && !lastRunResult.error && (
            <div className="mb-4 text-sm bg-[#eef8ea] text-[#2a5a4a] rounded-lg px-4 py-2.5">
              Scanned {lastRunResult.scanned} elder(s) — {lastRunResult.newEscalations} new escalation(s) raised.
            </div>
          )}
          {lastRunResult?.error && (
            <div className="mb-4 text-sm bg-red-50 text-red-600 rounded-lg px-4 py-2.5">{lastRunResult.error}</div>
          )}

          {escalationsLoading ? (
            <p className="text-sm text-gray-400">Loading active escalations…</p>
          ) : escalations.length === 0 ? (
            <p className="text-sm text-gray-400">No open escalations right now.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {escalations.map((esc) => (
                <div
                  key={esc._id}
                  className={`flex items-center justify-between rounded-xl px-5 py-3 ${
                    esc.severity === "Critical" ? "bg-red-50" : "bg-amber-50"
                  }`}
                >
                  <div>
                    <p className="font-medium text-sm text-[#1a1a1a]">
                      {esc.elderName} —{" "}
                      <span className={esc.severity === "Critical" ? "text-red-600" : "text-amber-600"}>
                        {esc.triggerType}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{esc.reason}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Checker: {esc.checkerName} · {new Date(esc.triggeredAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => clearEscalation(esc._id)}
                    className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          {TABS.map((tab) => {
            const count =
              tab.key === "all"
                ? elders.length
                : elders.filter((e) => e.category === tab.key).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === tab.key ? "bg-[#2a7a5a] text-white" : "bg-[#e6f2dd] text-[#2a5a4a]"
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-100 text-xs font-semibold text-gray-500 uppercase">
            <span>Elder</span>
            <span>Concern Score</span>
            <span>6-Week Trend</span>
            <span>Contributing Factor</span>
            <span></span>
          </div>
          {loading ? (
            <p className="p-6 text-gray-400 text-sm">Loading concern metrics…</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm">No elders in this category.</p>
          ) : (
            <table className="w-full">
              <tbody>
                {filtered.map((elder) => {
                  const style = CATEGORY_STYLES[elder.category];
                  const isExpanded = expandedId === elder.elderId;
                  return (
                    <Fragment key={elder.elderId}>
                      <tr className="border-t border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 align-middle" style={{ width: "26%" }}>
                          <p className="font-medium text-[#1a1a1a]">{elder.name}</p>
                          <p className="text-xs text-gray-400">Checker: {elder.checkerName}</p>
                        </td>
                        <td className="px-6 py-4 align-middle" style={{ width: "16%" }}>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${style.pill}`}>
                            {elder.concernScore}%
                          </span>
                        </td>
                        <td className="px-6 py-4 align-middle text-sm" style={{ width: "16%" }}>
                          <TrendLabel trend={elder.trend} />
                        </td>
                        <td className="px-6 py-4 align-middle text-sm text-gray-600" style={{ width: "28%" }}>
                          {elder.contributingFactors.join(", ")}
                        </td>
                        <td className="px-6 py-4 align-middle text-right" style={{ width: "14%" }}>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : elder.elderId)}
                            className="px-4 py-2 rounded-full bg-[#e6f2dd] text-[#2a5a4a] text-xs font-medium hover:bg-[#d7ecc9] transition"
                          >
                            {isExpanded ? "Hide Trend" : "View Trend"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && <ElderTrendPanel elder={elder} />}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}