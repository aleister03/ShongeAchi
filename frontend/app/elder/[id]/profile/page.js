"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import { api } from "@/lib/apiClient";
import Link from "next/link";

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right">{value || "—"}</span>
    </div>
  );
}

export default function ElderProfile() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [elder, setElder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/profile`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/elders/${id}?familyMemberId=${familyMemberId}`)
      .then((res) => setElder(res.data))
      .catch((err) => setError(err.message || "Couldn't load this profile."));
  }, [id, status, familyMemberId]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="profile" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {!elder && !error ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : elder ? (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8 flex items-center gap-6 relative">
              <Link
                href={`/elder/${id}/edit`}
                className="absolute top-6 right-6 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Edit
              </Link>
              <div className="w-20 h-20 rounded-full bg-[#e6f2dd] text-[#2a7a5a] flex items-center justify-center text-2xl font-bold">
                {elder.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1a1a1a]">{elder.name}</h1>
                <p className="text-gray-500 text-sm mt-1">
                  {elder.age} years old · {elder.gender} · {elder.phone}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    elder.status === "Assigned" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {elder.status === "Assigned" ? "Checker assigned" : "Waiting on checker assignment"}
                </span>
              </div>
            </div>

            {elder.bio && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h2>
                <p className="text-sm text-gray-700">{elder.bio}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Address</h2>
              <InfoRow label="Flat / Floor" value={elder.address?.flatFloor} />
              <InfoRow label="House No." value={elder.address?.houseNo} />
              <InfoRow label="Road" value={elder.address?.road} />
              <InfoRow label="Area / Thana" value={elder.address?.areaTahna} />
              <InfoRow label="City" value={elder.address?.city} />
              <InfoRow label="Postal Code" value={elder.address?.postalCode} />
              <InfoRow label="Country" value={elder.address?.country} />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Medical Conditions</h2>
              {elder.medicalConditions?.length ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {elder.medicalConditions.map((cond) => (
                    <span key={cond} className="bg-[#e6f2dd] text-[#2a5a4a] px-3 py-1.5 rounded-full text-sm">
                      {cond}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-4">None recorded</p>
              )}
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Mobility Notes</h2>
              <p className="text-sm text-gray-700">{elder.mobilityNotes || "None recorded"}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Primary Emergency Contact</h2>
              <InfoRow label="Name" value={elder.emergencyContact?.name} />
              <InfoRow label="Phone" value={elder.emergencyContact?.phone} />
              <InfoRow label="Relationship" value={elder.emergencyContact?.relationship} />
              {elder.emergencyContact?.note && <InfoRow label="Note" value={elder.emergencyContact.note} />}
            </div>

            {(elder.secondaryContact?.name || elder.secondaryContact?.phone) && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Secondary Contact</h2>
                <InfoRow label="Name" value={elder.secondaryContact?.name} />
                <InfoRow label="Phone" value={elder.secondaryContact?.phone} />
                <InfoRow label="Relationship" value={elder.secondaryContact?.relationship} />
                {elder.secondaryContact?.note && <InfoRow label="Note" value={elder.secondaryContact.note} />}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Visit Schedule</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {elder.visitSchedule?.days?.length ? (
                  elder.visitSchedule.days.map((day) => (
                    <span key={day} className="px-3 py-1.5 rounded-full text-sm font-medium bg-[#2a7a5a] text-white">
                      {day}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No days selected</p>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Escalates if no check-in within {elder.visitSchedule?.escalateAfterHours ?? 4} hours of the scheduled visit.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}