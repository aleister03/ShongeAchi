"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the terms and Privacy Policy."); return; }
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email, password, redirect: false, callbackUrl,
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogle() {
    await signIn("google", { callbackUrl });
  }

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 text-sm focus:outline-none focus:border-[#2a7a5a] transition";

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-10" style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
          <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
        </div>
        <div className="mb-20">
          <h1 className="text-5xl font-bold text-[#1a1a1a] leading-tight">
            A reliable place to{" "}
            <span className="text-[#2a7a5a]">stay connected</span>
            {" "}with your love ones{" "}
            <span className="text-[#2a7a5a]">anytime.</span>
          </h1>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center px-10 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-[#2a7a5a] text-center mb-10">
          Continue your journey with us
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-md w-full mx-auto">
          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password" className={inputClass} value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="w-4 h-4 accent-[#2a7a5a]" />
            I agree to terms and Privacy Policy.
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#2a7a5a] text-white rounded-lg font-medium hover:bg-[#1f5e44] transition disabled:opacity-50">
            {loading ? "Signing in..." : "Log in"}
          </button>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button type="button" onClick={handleGoogle} className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span className="text-gray-600 text-sm font-medium">Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have any account?{" "}
            <Link href="/signup" className="text-[#2a7a5a] font-medium hover:underline">Create Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
