"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import MessageThread from "@/app/components/MessageThread";
import { api } from "@/lib/apiClient";

const STORAGE_KEY = "shongeachi_checker_id";

export default function CheckerElderMessages() {
  const { elderId } = useParams();
  const router = useRouter();
  const [checkerId, setCheckerId] = useState(null);
  const [checkerName, setCheckerName] = useState("");
  const [elder, setElder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      router.replace("/checker");
      return;
    }
    setCheckerId(saved);
  }, [router]);

  useEffect(() => {
    if (!checkerId) return;
    api
      .get(`/api/checkers/${checkerId}`)
      .then((res) => setCheckerName(res.data.checker.name))
      .catch(() => {});
    api
      .get(`/api/elders/${elderId}`)
      .then((res) => setElder(res.data))
      .catch((err) => setError(err.message || "Couldn't load this elder."));
  }, [checkerId, elderId]);

  if (!checkerId) return null;

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <Navbar variant="inner" />
      <div className="px-10 py-10 max-w-2xl mx-auto">
        <Link href="/checker" className="text-xs text-gray-400 underline mb-4 inline-block">
          ← Back to your elders
        </Link>
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Messages {elder ? `— ${elder.name}` : ""}</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!elder ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : (
          <MessageThread
            elderId={elderId}
            role="checker"
            checkerId={checkerId}
            myName={checkerName || "Checker"}
            otherPartyLabel={`${elder.name}'s family`}
          />
        )}
      </div>
    </main>
  );
}