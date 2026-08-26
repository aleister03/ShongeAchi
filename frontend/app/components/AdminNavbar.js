"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/checkers", label: "Checkers" },
  { href: "/admin/elders", label: "Elders" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/platform-config", label: "Settings" },
];

export default function AdminNavbar() {
  const pathname = usePathname();

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

      <button className="px-5 py-2 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
        Admin Profile
      </button>
    </nav>
  );
}