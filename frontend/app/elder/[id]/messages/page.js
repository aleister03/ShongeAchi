"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import MessageThread from "@/app/components/MessageThread";
import { api } from "@/lib/apiClient";

export default function ElderMessages() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [elder, setElder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/messages`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";
  const myName = session?.user?.name || "Family member";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/elders/${id}?familyMemberId=${familyMemberId}`)
      .then((res) => setElder(res.data))
      .catch((err) => setError(err.message || "Couldn't load this elder."));
  }, [id, status, familyMemberId]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="messages" />
      <div className="px-10 py-10 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">Messages</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {!elder ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : (
          <MessageThread
            elderId={id}
            role="family"
            familyMemberId={familyMemberId}
            myName={myName}
            otherPartyLabel={`${elder.name}'s checker`}
          />
        )}
      </div>
    </main>
  );
}