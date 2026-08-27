"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckerHeader() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/signin");
  }

  return (
    <header className="checkerHeader">
      <Link href="/checker" className="checkerBrand">
        <Image src="/logo.png" alt="Shonge Achi" width={66} height={52} style={{ width: "auto", height: "52px" }} />
        <span>Shonge Achi</span>
      </Link>
      <button className="profileButton" onClick={logout}>Log out</button>
    </header>
  );
}
