"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();
  const links = [["Dashboard", "/admin"], ["Checkers", "/admin/checkers"], ["Elders", "/admin/elders"], ["Subscriptions", "/admin/subscriptions"], ["Assignments", "/admin/assignments"]];
  return <header className="adminHeader">
    <Link href="/" className="adminBrand"><Image src="/logo.png" alt="Shonge Achi" width={66} height={52} style={{ width: "auto", height: "52px" }}/><span>Shonge Achi</span></Link>
    <nav>{links.map(([label, href]) => <Link className={pathname.startsWith(href) && href !== "/admin" ? "active" : ""} href={href} key={href}>{label}</Link>)}</nav>
    <button className="profileButton">Admin Profile</button>
  </header>;
}
