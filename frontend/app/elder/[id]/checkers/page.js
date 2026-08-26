"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import { api } from "@/lib/apiClient";

export default function ElderChecker() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [elder, setElder] = useState(null);
  const [checkerInfo, setCheckerInfo] = useState(null);
  const [error, setError] = useState("");
  const [pendingRequest, setPendingRequest] = useState(null);
  const [reason, setReason] = useState("");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/checkers`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/elders/${id}?familyMemberId=${familyMemberId}`)
      .then((res) => setElder(res.data))
      .catch((err) => setError(err.message || "Couldn't load this elder."));
  }, [id, status, familyMemberId]);

  useEffect(() => {
    if (!elder?.assignedCheckerId) return;
    api.get(`/api/checkers/${elder.assignedCheckerId}`).then((res) => setCheckerInfo(res.data)).catch(() => {});
  }, [elder]);

  useEffect(() => {
    if (!elder?._id) return;
    api
      .get(`/api/checker-requests?elderId=${elder._id}`)
      .then((res) => setPendingRequest(res.data.find((r) => r.status === "Pending") || null))
      .catch(() => {});
  }, [elder]);

  async function submitRequest(type) {
    setRequesting(true);
    try {
      const res = await api.post("/api/checker-requests", {
        elderId: elder._id,
        familyMemberId,
        type,
        reason,
      });
      setPendingRequest(res.data);
    } catch (err) {
      setError(err.message || "Couldn't submit the request.");
    } finally {
      setRequesting(false);
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="checkers" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Checker</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!elder ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : !elder.assignedCheckerId ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-gray-600 mb-4">
              Waiting on checker assignment — an admin hasn&apos;t assigned a checker to {elder.name} yet.
            </p>
            {pendingRequest?.type === "Assign" ? (
              <p className="text-sm bg-amber-50 text-amber-700 rounded-lg px-4 py-3 inline-block">
                Your request has been sent to the admin team.
              </p>
            ) : (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3 h-20 resize-none"
                  placeholder="Anything the admin should know (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button
                  onClick={() => submitRequest("Assign")}
                  disabled={requesting}
                  className="px-6 py-2.5 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#1f5e44] transition disabled:opacity-50"
                >
                  {requesting ? "Submitting..." : "Request a Checker"}
                </button>
              </>
            )}
          </div>
        ) : !checkerInfo ? (
          <p className="text-gray-400 text-sm">Loading checker details…</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#e6f2dd] text-[#2a7a5a] flex items-center justify-center text-xl font-bold">
                {checkerInfo.checker.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{checkerInfo.checker.name}</p>
                <p className="text-sm text-gray-500">{checkerInfo.checker.serviceArea}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{checkerInfo.checker.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Experience</p>
                <p className="font-medium text-gray-800">{checkerInfo.checker.experienceYears} years</p>
              </div>
              <div>
                <p className="text-gray-500">Working hours</p>
                <p className="font-medium text-gray-800">
                  {checkerInfo.checker.workingHours?.start} – {checkerInfo.checker.workingHours?.end}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Visits this month</p>
                <p className="font-medium text-gray-800">{checkerInfo.performance?.visitsThisMonth ?? 0}</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              {pendingRequest?.type === "Remove" ? (
                <p className="text-sm bg-amber-50 text-amber-700 rounded-lg px-4 py-3">
                  A request to remove this checker is pending admin review.
                </p>
              ) : (
                <>
                  <textarea
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm mb-3 h-20 resize-none"
                    placeholder="Reason for requesting a change (optional)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    onClick={() => submitRequest("Remove")}
                    disabled={requesting}
                    className="px-5 py-2 rounded-full border border-red-300 text-red-600 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {requesting ? "Submitting..." : "Request to Remove Checker"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}