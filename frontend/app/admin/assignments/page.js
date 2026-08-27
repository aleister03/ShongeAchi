"use client";

import { useEffect, useState } from "react";

import { formatAddress } from "@/app/lib/address.js";

import AdminNavbar from "../../components/AdminNavbar";

import { api } from "@/lib/apiClient";

export default function IntelligentAssignment() {
  const [waiting, setWaiting] = useState([]);
  const [selected, setSelected] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [rejected, setRejected] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWaiting();
  }, []);

  async function loadWaiting() {
    setLoadingList(true);
    setError("");

    try {
      const res = await api.get(
        "/api/elders?status=Waiting"
      );

      setWaiting(res.data || []);
    } catch (error) {
      console.error(
        "[assignment] Failed to load waiting elders:",
        error
      );

      setError(
        error?.message ||
          "Failed to load elders waiting for assignment."
      );
    } finally {
      setLoadingList(false);
    }
  }

  async function selectElder(elder) {
    setSelected(elder);
    setRejected([]);
    setRecommendations([]);
    setLoadingRecs(true);
    setError("");

    try {
      const res = await api.get(
        `/api/assignments/recommend?elderId=${elder._id}`
      );

      setRecommendations(
        res.data?.recommendations ||
          res.recommendations ||
          []
      );
    } catch (error) {
      console.error(
        "[assignment] Failed to get recommendations:",
        error
      );

      setError(
        error?.message ||
          "Failed to load checker recommendations."
      );
    } finally {
      setLoadingRecs(false);
    }
  }

  function reject(checkerId) {
    setRejected((previous) =>
      previous.includes(checkerId)
        ? previous
        : [...previous, checkerId]
    );
  }

  async function approve(checkerId) {
    if (!selected) return;

    setError("");

    try {
      await api.post(
        "/api/assignments/approve",
        {
          elderId: selected._id,
          checkerId,
        }
      );

      setSelected(null);
      setRecommendations([]);
      setRejected([]);

      await loadWaiting();
    } catch (error) {
      console.error(
        "[assignment] Failed to approve assignment:",
        error
      );

      setError(
        error?.message ||
          "Failed to assign the checker."
      );
    }
  }

  const visibleRecommendations =
    recommendations.filter((recommendation) => {
      const checker =
        recommendation.checker || recommendation;

      return !rejected.includes(checker._id);
    });

  return (
    <main
      className="min-h-screen"
      style={{ background: "#FBF3D9" }}
    >
      <AdminNavbar />

      <div className="px-10 py-10">
        <h1 className="mb-8 text-3xl font-bold text-[#1a1a1a]">
          Intelligent Checker Assignment
        </h1>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-[320px_1fr] gap-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-bold text-[#1a1a1a]">
              Waiting for Assignment
            </h2>

            <div className="flex flex-col gap-3">
              {loadingList && (
                <p className="text-sm text-gray-400">
                  Loading...
                </p>
              )}

              {!loadingList &&
                waiting.length === 0 && (
                  <p className="text-sm text-gray-400">
                    No elders waiting for assignment.
                  </p>
                )}

              {waiting.map((elder) => (
                <button
                  key={elder._id}
                  type="button"
                  onClick={() =>
                    selectElder(elder)
                  }
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                    selected?._id === elder._id
                      ? "bg-[#d9ecd0]"
                      : "bg-[#eef6ea] hover:bg-[#e4f0dc]"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                    {elder.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1a1a1a]">
                      {elder.name}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {formatAddress(elder.address)}
                    </p>

                    {elder.medicalConditions?.length > 0 && (
                      <p className="truncate text-xs text-gray-500">
                        {elder.medicalConditions.join(", ")}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            {!selected ? (
              <p className="text-sm text-gray-400">
                Select an elder from the left to see
                recommended checkers.
              </p>
            ) : (
              <>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a1a]">
                      {selected.name}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {formatAddress(selected.address)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {selected.visitSchedule?.days?.join(
                        ", "
                      ) || "No visit days set"}
                    </p>

                    {selected.medicalConditions?.length > 0 && (
                      <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                        {selected.medicalConditions.join(
                          ", "
                        )}
                      </span>
                    )}
                  </div>

                  <span className="rounded-full bg-[#e6f2dd] px-4 py-1.5 text-sm font-medium text-[#2a5a4a]">
                    Recommended Checkers
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {loadingRecs && (
                    <p className="text-sm text-gray-400">
                      Finding the best checkers...
                    </p>
                  )}

                  {!loadingRecs &&
                    visibleRecommendations.length === 0 && (
                      <p className="text-sm text-gray-400">
                        No eligible checkers available right now.
                      </p>
                    )}

                  {!loadingRecs &&
                    visibleRecommendations.map(
                      (recommendation) => {
                        const checker =
                          recommendation.checker ||
                          recommendation;

                        const assignedCount =
                          recommendation.assignedCount ??
                          checker.currentWorkload ??
                          0;

                        const matchScore =
                          recommendation.score ??
                          checker.matchScore ??
                          0;

                        return (
                          <div
                            key={checker._id}
                            className="flex items-center justify-between rounded-xl bg-[#f0f7ec] px-5 py-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdf0c8] text-sm font-semibold">
                                {checker.name
                                  ?.split(" ")
                                  .map(
                                    (part) => part[0]
                                  )
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <p className="font-medium text-[#1a1a1a]">
                                  {checker.name}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {checker.serviceArea} ·{" "}
                                  {checker.experienceYears ?? 0} yrs ·{" "}
                                  {assignedCount}/
                                  {checker.maxCapacity ??
                                    checker.maxWorkload ??
                                    0}{" "}
                                  assigned · match {matchScore}%
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  approve(checker._id)
                                }
                                className="rounded-full bg-[#4a8a5a] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3a7248]"
                              >
                                Approve
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  reject(checker._id)
                                }
                                className="rounded-full bg-[#e8a2a2] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#dc8b8b]"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}