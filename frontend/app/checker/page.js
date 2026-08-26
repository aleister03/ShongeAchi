"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { api } from "@/lib/apiClient";

const CATEGORY_STYLES = {
  Critical: "bg-red-100 text-red-600",
  Elevated: "bg-amber-100 text-amber-600",
  Stable: "bg-green-100 text-green-700",
};

const STORAGE_KEY = "shongeachi_checker_id";

// ---------------------------------------------------------------------
// NOTE: there is no checker login/session system in this project yet
// (checkers have a passwordHash from signup, but no authenticate route).
// Until that exists, this page asks the checker to enter their Checker ID
// once and remembers it in this browser via localStorage — the same
// caller-supplied-id trust model the backend routes already use. Swap
// this gate out for a real login flow once one exists; nothing else on
// this page needs to change, since the backend already checks the
// assignment relationship server-side regardless of how checkerId got here.
// ---------------------------------------------------------------------
function CheckerIdGate({ onSubmit }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) {
      setError("Enter your Checker ID.");
      return;
    }
    try {
      // Confirms the id actually belongs to a real, approved checker before
      // saving it, so we don't send someone into a page full of 403s.
      await api.get(`/api/wellbeing/checker/${value.trim()}`);
      localStorage.setItem(STORAGE_KEY, value.trim());
      onSubmit(value.trim());
    } catch (err) {
      setError(err.message || "That Checker ID couldn't be verified.");
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-sm p-8 mt-16">
      <h2 className="text-lg font-semibold text-[#1a1a1a] mb-1">Checker sign-in</h2>
      <p className="text-sm text-gray-500 mb-5">
        Enter your Checker ID to view and update the elders assigned to you.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Checker ID"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2a7a5a] mb-3"
        />
        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#236b4d] transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

/** One assigned elder's score, with an inline form to submit an override. */
function AssignedElderCard({ elder, checkerId, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [scoreInput, setScoreInput] = useState(elder.concernScore);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    const numeric = Number(scoreInput);
    if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
      setError("Score must be a number between 0 and 100.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await patchConcernScore(elder.elderId, { checkerId, score: numeric, note });
      setNote("");
      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err.message || "Couldn't save the update.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-3">
        <p className="text-lg font-semibold text-[#1a1a1a]">{elder.name}</p>
        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${CATEGORY_STYLES[elder.category]}`}>
          {elder.concernScore}% · {elder.category}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Contributing factors</p>
        <ul className="text-sm text-gray-700 list-disc list-inside">
          {elder.contributingFactors.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      {elder.override && (
        <div className="mb-3 text-xs bg-[#fff9e8] text-amber-700 rounded-lg px-3 py-2">
          Currently overridden{elder.override.note ? `: "${elder.override.note}"` : "."}
        </div>
      )}

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 rounded-full bg-[#e6f2dd] text-[#2a5a4a] text-xs font-medium hover:bg-[#d7ecc9] transition"
        >
          Update concern score
        </button>
      ) : (
        <div className="border-t border-gray-100 pt-4 mt-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">Score (0–100)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
          />
          <label className="block text-xs font-medium text-gray-600 mb-1">Note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Why are you adjusting this score?"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3"
          />
          {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-[#2a7a5a] text-white text-xs font-medium hover:bg-[#236b4d] transition disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// apiClient.js only exposes get/post/put/del — PATCH isn't wired up there.
// Rather than edit the shared client for one call, send it directly here.
async function patchConcernScore(elderId, body) {
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:1078";
  const res = await fetch(`${API_URL}/api/wellbeing/${elderId}/concern-score`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json;
}

export default function CheckerView() {
  const [checkerId, setCheckerId] = useState(null);
  const [elders, setElders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setCheckerId(saved);
  }, []);

  useEffect(() => {
    if (!checkerId) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkerId]);

  async function load() {
    try {
      const res = await api.get(`/api/wellbeing/checker/${checkerId}`);
      setElders(res.data);
    } catch (err) {
      setError(err.message || "Couldn't load your assigned elders.");
    }
  }

  function switchChecker() {
    localStorage.removeItem(STORAGE_KEY);
    setCheckerId(null);
    setElders(null);
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <Navbar variant="inner" />
      <div className="px-10 py-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Your assigned elders</h1>
          {checkerId && (
            <button onClick={switchChecker} className="text-xs text-gray-400 underline">
              Not you? Switch Checker ID
            </button>
          )}
        </div>
        <p className="text-gray-500 mb-8">View concern scores and flag anything that needs closer monitoring</p>

        {!checkerId ? (
          <CheckerIdGate onSubmit={setCheckerId} />
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : elders === null ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : elders.length === 0 ? (
          <p className="text-gray-400 text-sm">No elders are currently assigned to you.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {elders.map((elder) => (
              <AssignedElderCard key={elder.elderId} elder={elder} checkerId={checkerId} onUpdated={load} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
