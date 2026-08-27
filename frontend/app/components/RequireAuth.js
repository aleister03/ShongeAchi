"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Client-side guard for the signed-in areas.
//
// Without it, opening /admin or /family while logged out rendered the page, fired an
// API call, and showed a raw "Authentication required" error — which reads as a bug
// rather than as "please sign in". Signing in with the wrong role behaved the same.
//
// This is a usability guard, not the security boundary: every endpoint independently
// enforces requireAuth()/assertElderAccess(), so nothing is protected by the browser
// alone. It only decides what to render.
export default function RequireAuth({ roles, children }) {
  const router = useRouter();
  const [state, setState] = useState("checking");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const stored = localStorage.getItem("user");
    if (!token || !stored) {
      router.replace("/signin");
      return;
    }
    let user;
    try { user = JSON.parse(stored); } catch { router.replace("/signin"); return; }

    if (roles?.length && !roles.includes(user.role)) {
      // Signed in, but in the wrong area — send them to their own.
      router.replace({ admin: "/admin", checker: "/checker", family: "/family" }[user.role] ?? "/signin");
      return;
    }
    setState("allowed");
  }, [roles, router]);

  if (state !== "allowed") return null;
  return children;
}
