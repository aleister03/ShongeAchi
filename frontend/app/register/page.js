// frontend/app/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const body = await apiRequest("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "family" })
      });
      localStorage.setItem("token", body.data.token);
      localStorage.setItem("user", JSON.stringify(body.data.user));
      router.push("/register-elder");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(145deg,#eaf4e4,#c6ded8)] px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-[#234f42]">Create a Family Account</h1>
        {error && <p className="mb-4 text-sm text-red-600" role="alert">{error}</p>}
        <input placeholder="Your name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mb-3 w-full rounded-xl border border-[#cbd9d2] px-4 py-3" />
        <input type="email" placeholder="Email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-3 w-full rounded-xl border border-[#cbd9d2] px-4 py-3" />
        <input type="password" placeholder="Password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-5 w-full rounded-xl border border-[#cbd9d2] px-4 py-3" />
        <button disabled={loading} className="w-full rounded-full bg-[#2a7a5a] px-5 py-3 font-medium text-white">
          {loading ? "Creating…" : "Create Account"}
        </button>
      </form>
    </main>
  );
}