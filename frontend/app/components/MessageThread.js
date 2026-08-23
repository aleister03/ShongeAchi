"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/apiClient";

export default function MessageThread({ elderId, role, familyMemberId, checkerId, myName, otherPartyLabel }) {
  const [messages, setMessages] = useState(null);
  const [gateInfo, setGateInfo] = useState(null); 
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const callerParam =
    role === "family" ? `familyMemberId=${encodeURIComponent(familyMemberId)}` : `checkerId=${encodeURIComponent(checkerId)}`;

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function load() {
    try {
      const res = await api.get(`/api/messages/${elderId}?role=${role}&${callerParam}`);
      setMessages(res.data.messages);
      setGateInfo({ isPremium: res.data.isPremium, hasCheckerAssigned: res.data.hasCheckerAssigned });
      setError("");
    } catch (err) {
      setError(err.message || "Couldn't load messages.");
    }
  }

  async function send(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await api.post(`/api/messages/${elderId}`, {
        role,
        familyMemberId: role === "family" ? familyMemberId : undefined,
        checkerId: role === "checker" ? checkerId : undefined,
        senderName: myName,
        text: draft.trim(),
      });
      setDraft("");
      load();
    } catch (err) {
      setError(err.message || "Couldn't send that message.");
    } finally {
      setSending(false);
    }
  }

  if (messages === null && !error) {
    return <p className="text-sm text-gray-400">Loading conversation…</p>;
  }
  if (error && messages === null) {
    return <p className="text-sm text-red-500">{error}</p>;
  }
  if (gateInfo && !gateInfo.hasCheckerAssigned) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-sm text-gray-500">
        Messaging opens up once a checker is assigned to this elder.
      </div>
    );
  }
  if (gateInfo && !gateInfo.isPremium) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <p className="text-gray-600 mb-4">Direct messaging with the assigned checker is a Premium feature.</p>
        <a
          href="/pricing"
          className="inline-block px-6 py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#236b4d] transition"
        >
          See Premium plans
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: "480px" }}>
      <div className="px-5 py-3 border-b border-gray-100 bg-[#f7faf5]">
        <p className="text-sm font-semibold text-[#2a5a4a]">Conversation with {otherPartyLabel}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            No messages yet — ask about an appointment, a medication reminder, or a special instruction.
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderRole === role;
            return (
              <div key={m._id} className={`max-w-[75%] ${isMine ? "self-end" : "self-start"}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMine ? "bg-[#2a7a5a] text-white" : "bg-[#eef6ea] text-gray-800"}`}>
                  {m.text}
                </div>
                <p className={`text-[11px] text-gray-400 mt-1 ${isMine ? "text-right" : "text-left"}`}>
                  {isMine ? "You" : m.senderName} ·{" "}
                  {new Date(m.createdAt).toLocaleString(undefined, { hour: "numeric", minute: "2-digit", month: "short", day: "numeric" })}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#2a7a5a]"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="px-5 py-2.5 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#236b4d] transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
      {error && <p className="px-4 pb-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}