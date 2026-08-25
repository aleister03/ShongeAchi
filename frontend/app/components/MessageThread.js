"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/apiClient";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 15 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

export default function MessageThread({ elderId, role, familyMemberId, checkerId, myName, otherPartyLabel }) {
  const [messages, setMessages] = useState(null);
  const [gateInfo, setGateInfo] = useState(null);
  const [draft, setDraft] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  const callerParam =
    role === "family" ? `familyMemberId=${encodeURIComponent(familyMemberId)}` : `checkerId=${encodeURIComponent(checkerId)}`;

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [elderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(
    () => () => {
      if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    },
    [pendingFile]
  );

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

  function handleFilePick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setFileError("");

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      setFileError("Only JPG/PNG/GIF/WEBP images or MP4/WEBM/MOV videos are supported.");
      return;
    }
    const kind = isImage ? "image" : "video";
    const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
    if (file.size > maxBytes) {
      setFileError(`${isImage ? "Images" : "Videos"} must be ${Math.round(maxBytes / (1024 * 1024))}MB or smaller.`);
      return;
    }

    setPendingFile({ file, kind, previewUrl: URL.createObjectURL(file) });
  }

  function clearPendingFile() {
    if (pendingFile?.previewUrl) URL.revokeObjectURL(pendingFile.previewUrl);
    setPendingFile(null);
    setFileError("");
  }

  async function send(e) {
    e.preventDefault();
    if (!draft.trim() && !pendingFile) return;
    setSending(true);
    setError("");
    try {
      let attachment;
      if (pendingFile) {
        const data = await fileToBase64(pendingFile.file);
        attachment = { kind: pendingFile.kind, data, mimeType: pendingFile.file.type };
      }
      await api.post(`/api/messages/${elderId}`, {
        role,
        familyMemberId: role === "family" ? familyMemberId : undefined,
        checkerId: role === "checker" ? checkerId : undefined,
        senderName: myName,
        text: draft.trim(),
        attachment,
      });
      setDraft("");
      clearPendingFile();
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
    <div className="flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: "520px" }}>
      <div className="px-5 py-3 border-b border-gray-100 bg-[#f7faf5]">
        <p className="text-sm font-semibold text-[#2a5a4a]">Conversation with {otherPartyLabel}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">
            No messages yet — ask about an appointment, a medication reminder, or a special instruction. You can
            attach a photo or short video too.
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderRole === role;
            return (
              <div key={m._id} className={`max-w-[75%] ${isMine ? "self-end" : "self-start"}`}>
                <div className={`rounded-2xl overflow-hidden ${isMine ? "bg-[#2a7a5a]" : "bg-[#eef6ea]"}`}>
                  {m.attachment?.kind === "image" && (
                    <img src={m.attachment.data} alt="Shared attachment" className="w-full max-h-64 object-cover" />
                  )}
                  {m.attachment?.kind === "video" && (
                    <video src={m.attachment.data} controls className="w-full max-h-64 bg-black" />
                  )}
                  {m.text && (
                    <p className={`px-4 py-2.5 text-sm ${isMine ? "text-white" : "text-gray-800"}`}>{m.text}</p>
                  )}
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

      {pendingFile && (
        <div className="px-4 pt-3 flex items-center gap-3">
          <div className="relative">
            {pendingFile.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pendingFile.previewUrl} alt="Attachment preview" className="h-16 w-16 object-cover rounded-lg border border-gray-200" />
            ) : (
              <video src={pendingFile.previewUrl} className="h-16 w-16 object-cover rounded-lg border border-gray-200 bg-black" />
            )}
            <button
              type="button"
              onClick={clearPendingFile}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-700 text-white text-xs flex items-center justify-center"
              aria-label="Remove attachment"
            >
              ×
            </button>
          </div>
          <span className="text-xs text-gray-500">{pendingFile.file.name}</span>
        </div>
      )}
      {fileError && <p className="px-4 pt-2 text-xs text-red-500">{fileError}</p>}

      <form onSubmit={send} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
          onChange={handleFilePick}
          className="sr-only"
          id={`attachment-${elderId}-${role}`}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 flex-shrink-0 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition flex items-center justify-center text-lg"
          title="Attach a photo or video"
          aria-label="Attach a photo or video"
        >
          📎
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[#2a7a5a]"
        />
        <button
          type="submit"
          disabled={sending || (!draft.trim() && !pendingFile)}
          className="px-5 py-2.5 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#236b4d] transition disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
      {error && <p className="px-4 pb-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}