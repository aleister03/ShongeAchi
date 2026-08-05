import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">

      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-screen">
        <Image
          src="/hero-bg.jpg"
          alt="Elderly woman looking out the window"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <Navbar variant="home" />
        <div className="absolute inset-0 flex flex-col justify-center px-16 md:px-24 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Know they&apos;re okay,{" "}
            <span className="text-[#d4e84a]">even from a distance.</span>
          </h1>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">
            A verified checker visits your parent on a schedule you set. If a visit is missed, we tell you immediately, without any delay.
          </p>
          <Link
            href="#how-it-works"
            className="self-start px-8 py-3 rounded-full border border-white/70 text-white text-sm font-medium hover:bg-white/20 transition"
          >
            See How it Works?
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-8 md:px-20" style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}>
        <h2 className="text-4xl font-bold text-center text-[#2a5a4a] mb-4">How It Works</h2>
        <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
          A simple three-step process that gives you peace of mind every single day.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {[
            { step: "01", title: "Register Your Elder", desc: "Create a profile for your elderly parent with their medical conditions, address, and preferred visit schedule." },
            { step: "02", title: "A Checker Visits", desc: "A verified local checker visits your parent on the scheduled days and submits a wellbeing report after each visit." },
            { step: "03", title: "You Stay Informed", desc: "If a visit is missed or a concern is flagged, you are notified immediately so you can take action right away." }
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-4">
              <span className="text-4xl font-bold text-[#d4e84a]">{step}</span>
              <h3 className="text-xl font-semibold text-[#2a5a4a]">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY SHONGE ACHI ── */}
      <section className="py-24 px-8 md:px-20 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#2a5a4a] mb-4">Why Shonge Achi?</h2>
        <p className="text-center text-gray-600 mb-16 text-lg max-w-2xl mx-auto">
          Built specifically for families separated by distance, not just another monitoring app.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            { icon: "✅", title: "Verified Checkers", desc: "Every checker is vetted, trained, and assigned to a cluster of elders within a walkable radius." },
            { icon: "🔔", title: "Automatic Escalation", desc: "If a visit is missed, the system automatically notifies your family contact chain without manual intervention." },
            { icon: "🤖", title: "AI Wellbeing Analysis", desc: "Our AI detects gradual health deterioration by comparing visit history, not just single incidents." },
            { icon: "🔒", title: "Secure & Private", desc: "All data is encrypted and only accessible to authorized family members and verified checkers." }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-5 p-6 rounded-2xl border border-[#e6f2dd] hover:shadow-md transition">
              <span className="text-3xl">{icon}</span>
              <div>
                <h3 className="text-lg font-semibold text-[#2a5a4a] mb-2">{title}</h3>
                <p className="text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-8 text-center" style={{ background: "linear-gradient(to bottom, #C3DCD6, #E6F2DD)" }}>
        <h2 className="text-4xl font-bold text-[#2a5a4a] mb-4">Ready to get started?</h2>
        <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
          Register your elderly parent today and let Shonge Achi handle the daily wellbeing checks.
        </p>
        <Link
          href="/register-elder"
          className="px-10 py-4 bg-[#2a7a5a] text-white rounded-full font-medium text-lg hover:bg-[#1f5e44] transition"
        >
          Register an Elder
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#2a5a4a] text-white/80 text-center py-6 text-sm">
        © 2026 Shonge Achi. All rights reserved.
      </footer>

    </main>
  );
}