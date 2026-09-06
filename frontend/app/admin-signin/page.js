"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function AdminSignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Sign-in failed.");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Image src="/logo.png" alt="Shonge Achi Logo" width={40} height={40} />
          <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
        </div>
        <h1 className="text-lg font-semibold text-[#1a1a1a] mb-1 text-center">Admin sign-in</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">Enter the admin passcode to continue.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Admin passcode"
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#2a7a5a]"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#1f5e44] transition disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminSignIn() {
  return (
    <Suspense>
      <AdminSignInForm />
    </Suspense>
  );
}
