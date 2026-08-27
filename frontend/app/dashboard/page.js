"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { api } from "@/lib/apiClient";

const CATEGORY_STYLES = {
  Critical: "bg-red-100 text-red-600",
  Elevated: "bg-amber-100 text-amber-600",
  Stable: "bg-green-100 text-green-700",
};

function TrendLabel({ trendDetail }) {
  if (!trendDetail || trendDetail.direction === "stable") {
    return <span className="text-gray-400">Stable — no significant change</span>;
  }
  const color = trendDetail.direction === "up" ? "text-red-500" : "text-green-600";
  return <span className={`font-medium ${color}`}>{trendDetail.label} over the last {trendDetail.weeks} week(s)</span>;
}


function ElderConcernCard({ elder, familyMemberId }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await api.get(`/api/elders/${elder._id}/summary?familyMemberId=${familyMemberId}`);
        if (!cancelled) setSummary(res.data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Couldn't load this elder's dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [elder._id, familyMemberId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link
            href={`/elder/${elder._id}/profile`}
            className="text-lg font-semibold text-[#1a1a1a] hover:text-[#2a7a5a] hover:underline transition"
          >
            {elder.name}
          </Link>
          <p className="text-xs text-gray-400">
            {elder.status === "Assigned" ? "Checker assigned" : "Waiting on checker assignment"}
          </p>
        </div>
        {!loading && !error && (
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${CATEGORY_STYLES[summary.category]}`}>
            {summary.concernScore}% · {summary.category}
          </span>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <>
          {summary.openEscalationCount > 0 && (
            <Link
              href={`/elder/${elder._id}/wellbeing`}
              className="block mb-3 text-sm bg-red-50 text-red-600 rounded-lg px-3 py-2 hover:bg-red-100 transition"
            >
              {summary.openEscalationCount} open escalation{summary.openEscalationCount > 1 ? "s" : ""} —{" "}
              {summary.latestEscalation?.reason}
            </Link>
          )}

          <p className="text-sm text-gray-600 mb-3">
            <TrendLabel trendDetail={summary.trendDetail} />
          </p>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Today</p>
              {summary.todayVisit ? (
                <p className="text-gray-800">
                  {summary.todayVisit.status} at{" "}
                  {new Date(summary.todayVisit.visitDate).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                </p>
              ) : (
                <p className="text-gray-400">No visit yet</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Checker</p>
              <p className="text-gray-800">{summary.checker?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Next visit</p>
              <p className="text-gray-800">
                {summary.upcomingVisit
                  ? summary.upcomingVisit.isToday
                    ? "Today"
                    : summary.upcomingVisit.dayName
                  : "Not scheduled"}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function FamilyDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [elders, setElders] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin?callbackUrl=/dashboard");
    }
  }, [status, router]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/elders?familyMemberId=${familyMemberId}`)
      .then((res) => setElders(res.data))
      .catch(() => setElders([]));
  }, [status, familyMemberId]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <Navbar variant="inner" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-1">Your wellbeing dashboard</h1>
        <p className="text-gray-500 mb-8">Concern scores for the elders registered to your account</p>

        {elders === null ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : elders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">You haven&apos;t registered an elder yet.</p>
            <Link
              href="/register-elder"
              className="inline-block px-6 py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#236b4d] transition"
            >
              Register an elder
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {elders.map((elder) => (
              <ElderConcernCard key={elder._id} elder={elder} familyMemberId={familyMemberId} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
