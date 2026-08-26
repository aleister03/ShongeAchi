"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

export default function CheckerRequests() {
  const [requests, setRequests] = useState(null);

  async function load() {
    const res = await api.get("/api/checker-requests?status=Pending");
    setRequests(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id, approve) {
    await api.post(`/api/checker-requests/${id}/resolve`, { approve });
    load();
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-8">Checker Removal Requests</h1>

        {requests === null ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#1a1a1a]">{r.elderName}</p>
                  <p className="text-sm text-gray-600">
                    {r.type === "Remove" ? (
                      <>
                        Requesting removal of <strong>{r.previousCheckerName}</strong>
                      </>
                    ) : (
                      "Requesting a checker be assigned"
                    )}
                  </p>
                  {r.reason && <p className="text-sm text-gray-500 mt-1">&ldquo;{r.reason}&rdquo;</p>}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => resolve(r._id, false)}
                    className="px-5 py-2 rounded-full border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => resolve(r._id, true)}
                    className="px-5 py-2 rounded-full bg-[#2a7a5a] text-white text-sm hover:bg-[#1f5e44] transition"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}