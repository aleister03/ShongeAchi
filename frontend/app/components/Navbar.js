"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar({ variant = "home" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = variant === "home";

  return (
    <nav className={`w-full flex items-center justify-between px-10 py-4 ${isHome ? "absolute top-0 left-0 z-50 bg-white/10 backdrop-blur-sm" : "bg-white border-b border-gray-100 shadow-sm"}`}>
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Shonge Achi Logo" width={48} height={48} />
        <span className={`text-xl font-semibold ${isHome ? "text-white" : "text-[#2a7a5a]"}`}>
          Shonge Achi
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        <Link href="/" className={`text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`}>Home</Link>
        <Link href="/about" className={`text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`}>About</Link>
        <Link href="/pricing" className={`text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`}>Pricing</Link>
        <Link href="/signin" className={`text-base font-medium hover:opacity-70 transition ${isHome ? "text-white" : "text-gray-700"}`}>Sign In</Link>
      </div>

      <Link
        href="/register-elder"
        className={`hidden md:block px-5 py-2 rounded-full border text-sm font-medium transition hover:opacity-80 ${isHome ? "border-white text-white hover:bg-white/20" : "border-[#2a7a5a] text-[#2a7a5a] hover:bg-[#e6f2dd]"}`}
      >
        Register an Elder
      </Link>
    </nav>
  );
}