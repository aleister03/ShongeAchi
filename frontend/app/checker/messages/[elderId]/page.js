"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import MessageThread from "@/app/components/MessageThread";
import { Card, ErrorMessage } from "@/app/components/ui/AdminUI";
import { api } from "@/lib/apiClient";

// Same localStorage-based checker gate the rest of the checker portal
// already uses (see app/checker/page.js) — no checker login/session
// system exists yet.
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
    <main className="checkerMain">
      <p className="eyebrow">
        <Link href="/checker">← Back to your elders</Link>
      </p>
      <Card>
        <strong>Messages {elder ? `— ${elder.name}` : ""}</strong>
        <ErrorMessage message={error} />

        {!elder ? (
          <p className="empty">Loading…</p>
        ) : (
          <MessageThread
            elderId={elderId}
            role="checker"
            checkerId={checkerId}
            myName={checkerName || "Checker"}
            otherPartyLabel={`${elder.name}'s family`}
          />
        )}
      </Card>
    </main>
  );
}
