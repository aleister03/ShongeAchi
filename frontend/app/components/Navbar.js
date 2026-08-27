"use client";
// Merge fix: this component was merged from two versions and lost its React import
// while gaining next-auth's — so useState/useEffect were undefined and prerendering
// /about (and every page importing Navbar) failed with "useState is not defined".
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import NotificationBell from "@/app/components/NotificationBell";

export default function Navbar({ variant = "home" }) {
  // The codebase currently has two auth systems: next-auth (SessionProvider in the
  // root layout) and a JWT kept in localStorage, which is what all 20 backend routes
  // actually enforce via requireAuth(). Until one is retired, this reads BOTH so the
  // navbar is correct whichever way the person signed in. localStorage wins because
  // it carries the role the API authorises against.
  const { data: session } = useSession();
  const isHome = variant === "home";
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    try { setStoredUser(JSON.parse(raw)); } catch { /* ignore malformed */ }
  }, []);

  const user = storedUser ?? (session?.user
    ? { name: session.user.name, role: session.user.role ?? "family" }
    : null);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Clear the next-auth session too, so signing out of one clears both.
    if (session) { signOut({ callbackUrl: "/" }); return; }
    window.location.assign("/");
  }

  const linkClass = `text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`;


  return (
    <nav className={`w-full flex items-center justify-between px-10 py-4 ${isHome ? "absolute top-0 left-0 z-50 bg-white/10 backdrop-blur-sm" : "bg-white border-b border-gray-100 shadow-sm"}`}>
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Shonge Achi Logo" width={48} height={48} />
        <span className={`text-xl font-semibold ${isHome ? "text-white" : "text-[#2a7a5a]"}`}>
          Shonge Achi
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="/" className={linkClass}>Home</Link>
        <Link href="/about" className={linkClass}>About</Link>
        <Link href="/pricing" className={linkClass}>Pricing</Link>
        <Link href="/become-a-checker" className={linkClass}>Become a Checker</Link>
        {session && (
          <Link href="/dashboard" className={linkClass}>Dashboard</Link>
        )}
        {session && (
          <div className={isHome ? "bg-white/90 rounded-full" : ""}>
            <NotificationBell />
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-4">
        {session ? (
          <button onClick={() => signOut({ callbackUrl: "/" })} className={linkClass}>
            Sign Out
          </button>
        ) : (
          <Link href="/signin" className={linkClass}>Sign In</Link>
        )}
        <Link
          href="/register-elder"
          className={`px-5 py-2 rounded-full border text-sm font-medium transition hover:opacity-80 ${isHome ? "border-white text-white hover:bg-white/20" : "border-[#2a7a5a] text-[#2a7a5a] hover:bg-[#e6f2dd]"}`}
        >
          Register an Elder
        </Link>
      </div>
    </nav>
  );
}