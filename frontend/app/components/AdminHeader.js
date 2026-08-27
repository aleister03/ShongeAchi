"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("Admin");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setName(JSON.parse(stored).name || "Admin"); } catch { /* keep default */ }
    }
  }, []);

  // Mirrors CheckerHeader's logout so both staff areas behave identically.
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  }

  const links = [
    ["Dashboard", "/admin"],
    ["Checkers", "/admin/checkers"],
    ["Elders", "/admin/elders"],
    ["Subscriptions", "/admin/subscriptions"],
    ["Assignments", "/admin/assignments"]
  ];

  // "/admin" is a prefix of every other admin route, so it only counts as active on
  // an exact match. Previously it was excluded outright and could never highlight.
  const isActive = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <header className="adminHeader">
      <Link href="/admin" className="adminBrand">
        <Image src="/logo.png" alt="Shonge Achi" width={66} height={52} style={{ width: "auto", height: "52px" }} />
        <span>Shonge Achi</span>
      </Link>
      <nav>
        {links.map(([label, href]) => (
          <Link className={isActive(href) ? "active" : ""} href={href} key={href}>{label}</Link>
        ))}
      </nav>
      <div className="headerActions">
        <span className="muted" title="Signed in as">{name}</span>
        <button className="profileButton" onClick={logout}>Log out</button>
      </div>
    </header>
  );
}
