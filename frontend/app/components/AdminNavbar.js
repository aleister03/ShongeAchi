"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// CHANGED: this used to link to /admin/elders and /admin/subscriptions,
// neither of which existed as pages (404) — while /admin/assignments and
// /admin/checker-requests, which DID exist, weren't linked from anywhere
// in the nav at all. Pointing the nav at the real pages, and re-adding
// Subscriptions now that it's backed by a real payment gateway.
const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/checkers", label: "Checkers" },
  { href: "/admin/assignments", label: "Assignments" },
  { href: "/admin/checker-requests", label: "Requests" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/platform-config", label: "Settings" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-auth", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="w-full flex items-center justify-between px-10 py-4 bg-[#FBF3D9] border-b border-[#f0e6c0]">
      <Link href="/admin" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Shonge Achi Logo" width={40} height={40} />
        <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
      </Link>

      <div className="hidden md:flex items-center gap-10">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-base font-medium transition ${
              pathname === href ? "text-[#2a7a5a]" : "text-gray-700 hover:opacity-70"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="px-5 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        Log out
      </button>
    </nav>
  );
}
