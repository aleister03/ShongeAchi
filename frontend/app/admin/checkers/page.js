"use client";
// Resolved from a bad merge: our import block survived but the teammate's component
// body did. Theirs is kept because it includes PendingApplications (approving checker
// signups), which our version did not have.
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AdminNavbar from "../../components/AdminNavbar";
import { api } from "@/lib/apiClient";

function workloadColor(assigned, max) {
  const ratio = assigned / max;
  if (ratio >= 1) return "bg-red-400";
  if (ratio >= 0.7) return "bg-amber-400";
  return "bg-green-400";
}

function PendingApplications({ checkers, onDecide }) {
  const pending = checkers.filter((c) => c.applicationStatus === "Pending");
  if (pending.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <h2 className="font-bold text-[#1a1a1a] mb-1">Pending Applications ({pending.length})</h2>
      <p className="text-sm text-gray-500 mb-5">New checker signups waiting on identity verification</p>
      <div className="flex flex-col gap-4">
        {pending.map((c) => (
          <div key={c._id} className="flex items-center justify-between bg-[#fff9e8] rounded-xl px-5 py-4">
            <div className="flex items-center gap-4">
              {c.profilePhoto ? (
                <Image src={c.profilePhoto} alt={c.name} width={44} height={44} unoptimized className="w-11 h-11 rounded-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gray-200" />
              )}
              <div>
                <p className="font-medium text-[#1a1a1a]">{c.name}</p>
                <p className="text-xs text-gray-500">{c.phone} · {c.serviceArea} · {c.experienceYears} yrs</p>
              </div>
              {c.nidPhoto && (
                <a href={c.nidPhoto} target="_blank" rel="noopener noreferrer" className="text-xs text-[#2a7a5a] underline ml-2">
                  View NID
                </a>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onDecide(c._id, "approve")}
                className="px-5 py-2 rounded-full bg-[#4a8a5a] text-white text-sm font-medium hover:bg-[#3a7248] transition"
              >
                Approve
              </button>
              <button
                onClick={() => onDecide(c._id, "reject")}
                className="px-5 py-2 rounded-full bg-[#e8a2a2] text-white text-sm font-medium hover:bg-[#dc8b8b] transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CheckerManagement() {
  const [checkers, setCheckers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaFilter, availableOnly]);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (areaFilter !== "all") params.set("area", areaFilter);
      if (availableOnly) params.set("availableOnly", "true");
      const res = await api.get(`/api/checkers?${params.toString()}`);
      setCheckers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDecide(checkerId, action) {
    try {
      await api.put(`/api/checkers/${checkerId}/verify`, { action });
      load();
    } catch (err) {
      console.error(err);
    }
  }

  const approvedOnly = checkers.filter((c) => c.applicationStatus !== "Pending");
  const filtered = approvedOnly.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const areas = [...new Set(checkers.map((c) => c.serviceArea))];

  const activeCount = approvedOnly.length;
  const atCapacityCount = approvedOnly.filter((c) => c.atCapacity).length;
  const pendingVerification = checkers.filter((c) => c.applicationStatus === "Pending").length;
  const avgWorkload = approvedOnly.length
    ? (approvedOnly.reduce((sum, c) => sum + c.assignedCount, 0) / approvedOnly.length).toFixed(1)
    : 0;

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <AdminNavbar />
      <div className="px-10 py-10">
        <h1 className="text-3xl font-bold text-[#1a1a1a] mb-1">Checker management</h1>
        <p className="text-gray-500 mb-8">Registered field checkers, service areas, and current workload</p>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Active checkers</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">{activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">At full capacity</p>
            <p className="text-3xl font-bold text-amber-500">{atCapacityCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Pending verification</p>
            <p className="text-3xl font-bold text-red-500">{pendingVerification}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Avg. workload</p>
            <p className="text-3xl font-bold text-[#1a1a1a]">
              {avgWorkload} <span className="text-base font-normal text-gray-400">/ 20</span>
            </p>
          </div>
        </div>

        <PendingApplications checkers={checkers} onDecide={handleDecide} />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <input
              placeholder="Search checker by name or area"
              className="w-full bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-[#2a7a5a]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="bg-[#e6f2dd] text-[#2a5a4a] rounded-full px-5 py-3 text-sm font-medium border-none focus:outline-none"
          >
            <option value="all">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button
            onClick={() => setAvailableOnly((v) => !v)}
            className={`px-5 py-3 rounded-full text-sm font-medium transition ${
              availableOnly ? "bg-[#2a7a5a] text-white" : "bg-[#e6f2dd] text-[#2a5a4a]"
            }`}
          >
            Available capacity only
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-100 text-xs font-semibold text-gray-500 uppercase">
            <span className="col-span-2">Checker</span>
            <span>Service Area</span>
            <span>Workload</span>
            <span>Experience</span>
            <span>Status</span>
          </div>
          {loading ? (
            <p className="p-6 text-gray-400 text-sm">Loading checkers...</p>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm">No checkers found.</p>
          ) : (
            filtered.map((c) => (
              <Link
                key={c._id}
                href={`/admin/checkers/${c._id}`}
                className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-t border-gray-50 hover:bg-gray-50 transition"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#e6f2dd] flex items-center justify-center text-[#2a5a4a] text-xs font-bold">
                    {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1a1a]">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.workingHours?.start}–{c.workingHours?.end}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{c.serviceArea}</span>
                <div>
                  <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full ${workloadColor(c.assignedCount, c.maxCapacity)}`}
                      style={{ width: `${Math.min((c.assignedCount / c.maxCapacity) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{c.assignedCount} of {c.maxCapacity} assigned</p>
                </div>
                <span className="text-sm text-gray-600">{c.experienceYears} yrs</span>
                <span className={`inline-block w-fit px-3 py-1 rounded-full text-xs font-medium ${
                  c.applicationStatus === "Rejected" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"
                }`}>
                  {c.applicationStatus === "Rejected" ? "Rejected" : "Verified"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
