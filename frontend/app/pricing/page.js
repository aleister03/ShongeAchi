import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Pricing() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}>
      <Navbar variant="inner" />

      <div className="max-w-5xl mx-auto px-8 py-24">
        <h1 className="text-5xl font-bold text-center text-[#2a5a4a] mb-4">Simple, Transparent Pricing</h1>
        <p className="text-center text-gray-600 text-xl mb-16 max-w-2xl mx-auto">
          Choose the plan that fits your family. No hidden fees, no surprises.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto">

          {/* Free Plan */}
          <div className="bg-white rounded-2xl p-10 shadow-sm border border-[#e6f2dd] flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#2a5a4a] mb-1">Free</h2>
              <p className="text-gray-500">Everything you need to get started</p>
            </div>
            <div className="text-5xl font-bold text-[#2a5a4a]">৳0 <span className="text-lg font-normal text-gray-400">/ month</span></div>
            <ul className="text-gray-600 space-y-3 text-base flex-1">
              {[
                "Scheduled check-ins",
                "Visit history & reports",
                "Standard escalation chain",
                "Email & in-app notifications",
                "Emergency contact management"
              ].map(f => (
                <li key={f} className="flex gap-3 items-start">
                  <span className="text-[#2a7a5a] font-bold mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register-elder" className="block text-center px-6 py-3 border border-[#2a7a5a] text-[#2a7a5a] rounded-full font-medium hover:bg-[#e6f2dd] transition">
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-[#2a7a5a] rounded-2xl p-10 shadow-lg flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Premium</h2>
              <p className="text-white/70">For families who want full peace of mind</p>
            </div>
            <div className="text-5xl font-bold text-white">৳800 <span className="text-lg font-normal text-white/60">/ month per elder</span></div>
            <ul className="text-white/90 space-y-3 text-base flex-1">
              {[
                "Everything in Free",
                "AI concern metrics & scoring",
                "AI-generated weekly summaries",
                "Customized visit frequency",
                "Direct family-checker messaging",
                "Priority escalation response"
              ].map(f => (
                <li key={f} className="flex gap-3 items-start">
                  <span className="text-[#d4e84a] font-bold mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/register-elder" className="block text-center px-6 py-3 bg-white text-[#2a7a5a] rounded-full font-medium hover:bg-[#e6f2dd] transition">
              Get Premium
            </Link>
          </div>

        </div>

        <p className="text-center text-gray-500 mt-12 text-base">
          Annual plan available at ৳8,000 per elder — save 2 months free.
        </p>
      </div>

      <footer className="bg-[#2a5a4a] text-white/80 text-center py-6 text-sm">
        © 2026 Shonge Achi. All rights reserved.
      </footer>
    </main>
  );
}