"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "@/lib/apiClient";

const SEVERITY_DOT = {
  Critical: "bg-red-500",
  Elevated: "bg-amber-500",
};

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function NotificationBell() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef(null);
  const familyMemberId = session?.user?.id;

  async function load() {
    if (!familyMemberId) return;
    try {
      const res = await api.get(`/api/notifications?familyMemberId=${familyMemberId}`);
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch {
      // silent — bell just stays empty if this fails
    }
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    load();
    const interval = setInterval(load, 30000); // light polling — no websockets needed for this
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, familyMemberId]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markRead(id) {
    try {
      await api.patch(`/api/notifications/${id}`, { read: true });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  }

  if (status !== "authenticated") return null;

  return (
    <div className="relative" ref={containerRef}>
      <button onClick={() => setOpen((o) => !o)} className="relative p-2 rounded-full hover:bg-gray-100 transition" aria-label="Notifications">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-30">
          <div className="px-4 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Notifications</div>
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n._id}
                href={`/elder/${n.elderId}/wellbeing`}
                onClick={() => !n.read && markRead(n._id)}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition ${!n.read ? "bg-[#f5faf3]" : ""}`}
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${SEVERITY_DOT[n.severity] || "bg-gray-400"}`} />
                <div className="min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {n.elderName} · {timeAgo(n.createdAt)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}