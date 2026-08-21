"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "../../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

function statusPill(status) {
  if (status === "Concerned") return "bg-orange-100 text-orange-600";
  if (status === "No Answer") return "bg-red-100 text-red-600";
  if (status === "No visits yet") return "bg-gray-100 text-gray-500";
  return "bg-green-100 text-green-700";
}

export default function CheckerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/checkers/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <main className="min-h-screen flex items-center justify-center text-gray-400">Loading...</main>;
  if (!data) return <main className="min-h-screen flex items-center justify-center text-gray-400">Checker not found.</main>;

  const { checker, capacity, performance, assignedElders } = data;

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10">
        <p className="text-sm text-gray-500 mb-6">
          <Link href="/admin/checkers" className="hover:underline">Checkers</Link> {" > "}
          <span className="text-[#2a7a5a] font-medium">{checker.name}</span>
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center justify-between mb-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#e6f2dd] flex items-center justify-center text-[#2a5a4a] text-lg font-bold">
              {checker.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">{checker.name}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {checker.serviceArea} · {checker.workingHours?.start} – {checker.workingHours?.end} · {checker.experienceYears} years experience
              </p>
              {checker.verified && (
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                  ✓ Verified checker
                </span>
              )}
            </div>
          </div>
          <button className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition">
            Edit Assignment
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-[#1a1a1a] mb-4">Capacity</h2>
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{ width: `${Math.min((capacity.assigned / capacity.max) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">{capacity.assigned} of {capacity.max} elders assigned</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-semibold text-[#1a1a1a] mb-4">Performance</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Visits this month</span><span className="font-semibold">{performance.visitsThisMonth}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">On-time rate</span><span className="font-semibold">{performance.onTimeRate}%</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Concern flags raised</span><span className="font-semibold">{performance.concernFlags}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">This period&apos;s earnings</span><span className="font-semibold">৳{performance.earnings.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="font-semibold text-[#1a1a1a] mb-4">Assigned elders ({assignedElders.length})</h2>
            <div className="flex flex-col gap-3">
              {assignedElders.length === 0 ? (
                <p className="text-sm text-gray-400">No elders assigned yet.</p>
              ) : (
                assignedElders.map((e) => (
                  <div key={e._id} className="flex items-center justify-between bg-[#f7faf5] rounded-xl px-4 py-3">
                    <div>
                      <p className="font-medium text-sm text-[#1a1a1a]">{e.name}</p>
                      <p className="text-xs text-gray-400">
                        {e.visitSchedule?.days?.length ? e.visitSchedule.days.join(", ") : "No schedule"} · {e.address?.houseNo} {e.address?.road}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusPill(e.lastVisitStatus)}`}>
                      {e.lastVisitStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
