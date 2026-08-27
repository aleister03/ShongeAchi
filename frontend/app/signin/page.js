// frontend/app/signin/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiRequest } from "@/app/lib/api.js";

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const body = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      localStorage.setItem("token", body.data.token);
      localStorage.setItem("user", JSON.stringify(body.data.user));
      const dest = { admin: "/admin", checker: "/checker", family: "/family" }[body.data.user.role];
      router.push(dest);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#eaf4e4,#c6ded8)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-[#234f42]">Sign In</h1>
        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
        <input type="email" placeholder="Email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-3 w-full rounded-xl border border-[#cbd9d2] px-4 py-3" />
        <input type="password" placeholder="Password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-5 w-full rounded-xl border border-[#cbd9d2] px-4 py-3" />
        <button disabled={loading} className="w-full rounded-full bg-[#2a7a5a] px-5 py-3 font-medium text-white">
          {loading ? "Signing in…" : "Sign In"}
        </button>
        <p className="mt-4 text-center text-sm text-gray-600">
          Family member? <Link href="/register" className="text-[#2a7a5a] font-medium">Create an account</Link>
        </p>
      </form>
    </main>
  );
}