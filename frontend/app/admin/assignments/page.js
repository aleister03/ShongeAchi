"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

// Leaflet touches `window` at load time, so it can never run during SSR.
const AssignmentMap = dynamic(() => import("../../components/AssignmentMap"), { ssr: false });

export default function IntelligentAssignment() {
  const [waiting, setWaiting] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [rejected, setRejected] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadWaiting();
    loadRequests();
  }, []);

  async function loadWaiting() {
    const res = await api.get("/api/elders?status=Waiting");
    setWaiting(res.data);
  }

  async function loadRequests() {
    const res = await api.get("/api/checker-requests?status=Pending");
    setRequests(res.data);
  }

  async function resolveRequest(id, approveIt) {
    await api.post(`/api/checker-requests/${id}/resolve`, { approve: approveIt });
    loadRequests();
    loadWaiting(); // an approved "Remove" puts the elder back in the Waiting list
  }

  async function selectElder(elder) {
    setSelected(elder);
    setRejected([]);
    setLoadingRecs(true);
    try {
      const res = await api.get(`/api/assignments/recommend?elderId=${elder._id}`);
      setRecommendations(res.data.recommendations);
    } finally {
      setLoadingRecs(false);
    }
  }

  function reject(checkerId) {
    setRejected((prev) => [...prev, checkerId]);
  }

  async function approve(checkerId) {
    await api.post("/api/assignments/approve", { elderId: selected._id, checkerId });
    setSelected(null);
    setRecommendations([]);
    loadWaiting();
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-8">Intelligent Checker Assignment</h1>

        {requests.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="font-bold text-[#1a1a1a] underline mb-4">
              Pending Requests <span className="text-sm font-normal text-gray-400">({requests.length})</span>
            </h2>
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div key={r._id} className="flex items-center justify-between bg-[#f0f7ec] rounded-xl px-5 py-4">
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{r.elderName}</p>
                    <p className="text-xs text-gray-500">
                      {r.type === "Remove" ? (
                        <>Requesting removal of <strong>{r.previousCheckerName}</strong></>
                      ) : (
                        "Requesting a checker be assigned"
                      )}
                    </p>
                    {r.reason && <p className="text-xs text-gray-400 mt-1">&ldquo;{r.reason}&rdquo;</p>}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => resolveRequest(r._id, true)}
                      className="px-5 py-2 rounded-full bg-[#4a8a5a] text-white text-sm font-medium hover:bg-[#3a7248] transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => resolveRequest(r._id, false)}
                      className="px-5 py-2 rounded-full bg-[#e8a2a2] text-white text-sm font-medium hover:bg-[#dc8b8b] transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-[320px_1fr] gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-bold text-[#1a1a1a] underline mb-4">Waiting for Assignment</h2>
            <div className="flex flex-col gap-3">
              {waiting.length === 0 && <p className="text-sm text-gray-400">No elders waiting.</p>}
              {waiting.map((elder) => (
                <button
                  key={elder._id}
                  onClick={() => selectElder(elder)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    selected?._id === elder._id ? "bg-[#d9ecd0]" : "bg-[#eef6ea] hover:bg-[#e4f0dc]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-[#1a1a1a]">{elder.name}</p>
                    <p className="text-xs text-gray-500">
                      {elder.address?.city} · {elder.medicalConditions?.join(", ") || "No conditions noted"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            {!selected ? (
              <p className="text-gray-400 text-sm">Select an elder from the left to see recommended checkers.</p>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">{selected.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selected.address?.areaTahna}, {selected.address?.city} | {selected.visitSchedule?.days?.join(", ") || "No days set"}
                    </p>
                    {selected.medicalConditions?.length > 0 && (
                      <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        {selected.medicalConditions.join(", ")}
                      </span>
                    )}
                  </div>
                  <span className="px-4 py-1.5 bg-[#e6f2dd] text-[#2a5a4a] rounded-full text-sm font-medium">
                    Recommended Checkers
                  </span>
                </div>

                {/* --- NEW: OpenStreetMap/Leaflet view of the elder + candidate checkers --- */}
                <div className="mb-6">
                  <AssignmentMap
                    elder={selected}
                    recommendations={recommendations.filter((r) => !rejected.includes(r.checker._id))}
                  />
                </div>
                {/* ------------------------------------------------------------------------- */}

                <div className="flex flex-col gap-4">
                  {loadingRecs ? (
                    <p className="text-sm text-gray-400">Finding the best checkers...</p>
                  ) : recommendations.filter((r) => !rejected.includes(r.checker._id)).length === 0 ? (
                    <p className="text-sm text-gray-400">No available checkers found nearby.</p>
                  ) : (
                    recommendations
                      .filter((r) => !rejected.includes(r.checker._id))
                      .map((rec) => (
                        <div key={rec.checker._id} className="flex items-center justify-between bg-[#f0f7ec] rounded-xl px-5 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#fdf0c8]" />
                            <div>
                              <p className="font-medium text-[#1a1a1a]">{rec.checker.name}</p>
                              <p className="text-xs text-gray-500">
                                {rec.checker.serviceArea} · {rec.checker.experienceYears} yrs · {rec.assignedCount}/{rec.checker.maxCapacity} assigned · match {rec.score}%
                                {rec.distanceKm != null && <> · {rec.distanceKm.toFixed(1)} km away</>}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => approve(rec.checker._id)}
                              className="px-5 py-2 rounded-full bg-[#4a8a5a] text-white text-sm font-medium hover:bg-[#3a7248] transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => reject(rec.checker._id)}
                              className="px-5 py-2 rounded-full bg-[#e8a2a2] text-white text-sm font-medium hover:bg-[#dc8b8b] transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
