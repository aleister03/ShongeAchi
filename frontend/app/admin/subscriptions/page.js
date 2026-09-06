"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

export default function AdminSubscriptionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/subscriptions/overview")
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Couldn't load subscriptions."));
  }, []);

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2a5a4a] mb-6">Subscriptions</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!data ? (
          <p className="text-gray-500">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">Total elders</p>
                <p className="text-2xl font-bold text-gray-900">{data.summary.totalElders}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">Premium subscribers</p>
                <p className="text-2xl font-bold text-[#2a7a5a]">{data.summary.premiumSubscribers}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">Monthly recurring value</p>
                <p className="text-2xl font-bold text-gray-900">৳{data.summary.activeMonthlyValue}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">Total collected</p>
                <p className="text-2xl font-bold text-gray-900">৳{data.summary.collected}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h2 className="font-bold text-[#1a1a1a] mb-4">Elders by plan</h2>
              <div className="divide-y divide-gray-50">
                {data.elders.map((e) => (
                  <div key={e._id} className="flex items-center justify-between py-3">
                    <span className="text-sm text-gray-800">{e.name}</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        e.isPremium ? "bg-[#d9e9e4] text-[#2a5a4a]" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {e.isPremium ? "Premium" : "Free"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-[#1a1a1a] mb-4">Recent payments</h2>
              {data.recentPayments.length === 0 ? (
                <p className="text-sm text-gray-400">No payments yet.</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {data.recentPayments.map((p) => (
                    <div key={p.paymentId} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-gray-800">{p.elderName}</span>
                      <span className="text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span className="text-gray-800">৳{p.amount} · {p.method}</span>
                      <span
                        className={`font-medium ${
                          p.status === "success" ? "text-green-600" : p.status === "pending" ? "text-gray-400" : "text-red-500"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
