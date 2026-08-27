"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import TrendChart from "@/app/components/TrendChart";
import { api } from "@/lib/apiClient";

const WEEK_OPTIONS = [4, 6, 8, 12];

const LEVEL_STYLES = {
  Low: { bar: "bg-green-500", label: "text-green-700" },
  Medium: { bar: "bg-amber-500", label: "text-amber-600" },
  High: { bar: "bg-red-500", label: "text-red-600" },
};
const LEVEL_WIDTH = { Low: "30%", Medium: "60%", High: "90%" };

function BreakdownBar({ label, level }) {
  const style = LEVEL_STYLES[level] || LEVEL_STYLES.Low;
  return (
    <div className="flex items-center gap-4 mb-4">
      <span className="w-28 text-sm text-gray-700 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${style.bar}`} style={{ width: LEVEL_WIDTH[level] || "10%" }} />
      </div>
      <span className={`w-16 text-sm font-medium text-right ${style.label}`}>{level}</span>
    </div>
  );
}

export default function WellbeingHistory() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [elderName, setElderName] = useState("");
  const [weeks, setWeeks] = useState(6);
  const [trend, setTrend] = useState(null);
  const [score, setScore] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [summary, setSummary] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/wellbeing`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api.get(`/api/elders/${id}?familyMemberId=${familyMemberId}`).then((res) => setElderName(res.data.name)).catch(() => {});
    api
      .get(`/api/wellbeing/${id}/concern-score?familyMemberId=${familyMemberId}`)
      .then((res) => setScore(res.data))
      .catch((err) => setError(err.message || "Couldn't load concern score."));
    api.get(`/api/wellbeing/${id}/concern-breakdown`).then((res) => setBreakdown(res.data)).catch(() => {});
    api.get(`/api/wellbeing/${id}/summary`).then((res) => setSummary(res.data)).catch(() => {});
    api
      .get(`/api/wellbeing/${id}/visits`)
      .then((res) => setLastVisit(res.data?.[0] || null))
      .catch(() => {});
  }, [id, status, familyMemberId]);

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/wellbeing/${id}/trend?weeks=${weeks}`)
      .then((res) => setTrend(res.data))
      .catch((err) => setError(err.message || "Couldn't load the trend chart."));
  }, [id, status, weeks]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  const trendLabel =
    score?.trendDetail?.direction === "up" ? "Declining" : score?.trendDetail?.direction === "down" ? "Improving" : "Stable";
  const trendColor =
    score?.trendDetail?.direction === "up" ? "text-red-500" : score?.trendDetail?.direction === "down" ? "text-green-600" : "text-gray-500";

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="wellbeing" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold text-[#2a5a4a]">{elderName || "Elder"} — Wellbeing trends in last</h1>
          <select
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:border-[#2a7a5a]"
          >
            {WEEK_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w} weeks
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#d9e9e4] rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Concern score</p>
              <p className="text-2xl font-bold text-gray-900">{score ? `${score.concernScore}%` : "—"}</p>
            </div>
            <div className="bg-[#d9e9e4] rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Visits Completed</p>
              <p className="text-2xl font-bold text-gray-900">{score ? `${score.completedVisits}/${score.totalVisits}` : "—"}</p>
            </div>
            <div className="bg-[#d9e9e4] rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Trend</p>
              <p className={`text-2xl font-bold ${trendColor}`}>{score ? trendLabel : "—"}</p>
            </div>
            <div className="bg-[#d9e9e4] rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Last Visit</p>
              <p className="text-lg font-bold text-gray-900">
                {lastVisit
                  ? new Date(lastVisit.visitDate).toLocaleString(undefined, { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })
                  : "No visits yet"}
              </p>
            </div>
          </div>

          {trend ? (
            trend.points.some((p) => p.concernScore !== null) ? (
              <TrendChart points={trend.points} />
            ) : (
              <p className="text-sm text-gray-400 py-12 text-center">Not enough visit history yet to chart a trend.</p>
            )
          ) : (
            <p className="text-sm text-gray-400 py-12 text-center">Loading chart…</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-5">Wellbeing Breakdown</h2>
          {breakdown && !breakdown.message ? (
            <>
              <BreakdownBar label="Appetite" level={breakdown.appetite} />
              <BreakdownBar label="Mobility" level={breakdown.mobility} />
              <BreakdownBar label="Mood" level={breakdown.mood} />
              <BreakdownBar
                label="Missed visits"
                level={breakdown.missedVisits > 1 ? "High" : breakdown.missedVisits === 1 ? "Medium" : "Low"}
              />
              <BreakdownBar
                label="Medication"
                level={breakdown.medicationMissed > 1 ? "High" : breakdown.medicationMissed === 1 ? "Medium" : "Low"}
              />
            </>
          ) : (
            <p className="text-sm text-gray-400 mb-4">No visits recorded yet.</p>
          )}

          {summary && (
            <div className="bg-[#d9e9e4] rounded-xl p-6 mt-6">
              <h3 className="text-lg font-bold text-[#2a5a4a] mb-3">AI weekly summary</h3>
              <p className="text-sm text-gray-800 leading-relaxed mb-4">{summary.summary}</p>
              {summary.recommendation === "Increase visit frequency" && (
                <span className="inline-block px-4 py-2 rounded-full border border-amber-400 bg-amber-50 text-amber-700 text-sm font-medium">
                  Increase visit frequency recommended
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}