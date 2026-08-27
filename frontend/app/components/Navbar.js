"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar({ variant = "home" }) {
  const isHome = variant === "home";
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  }

  const linkClass = `text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`;

  return (
    <nav className={`w-full flex items-center justify-between px-10 py-4 ${isHome ? "absolute top-0 left-0 z-50 bg-white/10 backdrop-blur-sm" : "bg-white border-b border-gray-100 shadow-sm"}`}>
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Shonge Achi Logo" width={61} height={48} style={{ width: "auto", height: "48px" }} />
        <span className={`text-xl font-semibold ${isHome ? "text-white" : "text-[#2a7a5a]"}`}>Shonge Achi</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="/" className={linkClass}>Home</Link>
        <Link href="/about" className={linkClass}>About</Link>
        <Link href="/pricing" className={linkClass}>Pricing</Link>
        {!user && <Link href="/checker-signup" className={linkClass}>Become a Checker</Link>}
        {user ? (
          <>
            <Link href={{ admin: "/admin", checker: "/checker", family: "/family" }[user.role]} className={linkClass}>
              {user.name}
            </Link>
            <button onClick={handleLogout} className={linkClass}>Log Out</button>
          </>
        ) : (
          <Link href="/signin" className={linkClass}>Sign In</Link>
        )}
      </div>

      <details className="md:hidden ml-auto text-gray-700">
        <summary className={`cursor-pointer ${isHome ? "text-white" : "text-gray-700"}`}>Menu</summary>
        <div className="absolute right-4 mt-3 flex min-w-40 flex-col gap-3 rounded-xl bg-white p-4 shadow-lg">
          <Link href="/">Home</Link><Link href="/about">About</Link><Link href="/pricing">Pricing</Link>
          {!user && <Link href="/checker-signup">Become a Checker</Link>}
          {user && (
            <Link href={{ admin: "/admin", checker: "/checker", family: "/family" }[user.role]}>
              {user.name}
            </Link>
          )}
          {user ? <button onClick={handleLogout}>Log Out</button> : <Link href="/signin">Sign In</Link>}
          {(!user || user.role === "family") && <Link href="/register-elder">Register an Elder</Link>}
        </div>
      </details>

      {(!user || user.role === "family") && <Link href="/register-elder" className={`hidden md:block px-5 py-2 rounded-full border text-sm font-medium transition hover:opacity-80 ${isHome ? "border-white text-white hover:bg-white/20" : "border-[#2a7a5a] text-[#2a7a5a] hover:bg-[#e6f2dd]"}`}>
        Register an Elder
      </Link>}
    </nav>
  );
}