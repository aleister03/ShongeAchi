"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "shongeachi_checker_id";

// Faithful port of the feature branch's dedicated checker header, adapted
// to main's checker-ID-gate identity (localStorage key holding a raw
// Checker _id) instead of a JWT "user" object.
export default function CheckerHeader() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    router.push("/checker");
  }

  return (
    <header className="checkerHeader">
      <Link href="/checker" className="checkerBrand">
        <Image src="/logo.png" alt="Shonge Achi" width={66} height={52} style={{ width: "auto", height: "52px" }} />
        <span>Shonge Achi</span>
      </Link>
      <button className="pillButton" onClick={logout}>Log out</button>
    </header>
  );
}
