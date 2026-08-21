"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import { api } from "@/lib/apiClient";

const STATUS_DOT = {
  Fine: "bg-green-500",
  Concerned: "bg-amber-500",
  "No Answer": "bg-red-500",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    weekday: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VisitHistory() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [visits, setVisits] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/visits`);
    }
  }, [status, router, id]);

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/wellbeing/${id}/visits`)
      .then((res) => setVisits(res.data))
      .catch((err) => setError(err.message || "Couldn't load visit history."));
  }, [id, status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="visits" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Visit History</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {visits === null ? (
            <p className="text-gray-400 text-sm">Loading…</p>
          ) : visits.length === 0 ? (
            <p className="text-gray-500 text-sm">No visits have been logged yet.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {visits.map((visit) => (
                <div key={visit._id} className="flex items-start gap-4">
                  <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${STATUS_DOT[visit.status] || "bg-gray-400"}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(visit.visitDate)} — {visit.checkerName}
                    </p>
                    <p className="text-sm text-gray-600">{visit.status}</p>
                    {visit.notes && <p className="text-sm text-gray-500 mt-0.5">&ldquo;{visit.notes}&rdquo;</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}