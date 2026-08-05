import Navbar from "../components/Navbar";
import Link from "next/link";

export default function About() {
  return (
    <main
      className="min-h-screen"
      style={{ background: "linear-gradient(to bottom, #E6F2DD, #C3DCD6)" }}
    >
      <Navbar variant="inner" />

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <h1 className="text-5xl font-bold text-[#2a5a4a] mb-6">
          About Shonge Achi
        </h1>
        <p className="text-gray-600 text-xl leading-relaxed mb-16">
          <span className="font-semibold text-[#2a5a4a]">Shonge Achi</span> —
          meaning <em>&quot;I am with you&quot;</em> in Bengali — is a wellbeing
          monitoring platform built for elderly people who live alone while their
          families live far away.
        </p>

        <div className="flex flex-col gap-8">
          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2a5a4a] mb-4">
              The Problem We Solve
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Millions of elderly parents in Bangladesh live alone while their
              children work in cities or abroad. Families rely on phone calls to
              check in, but calls get missed, schedules get forgotten, and small
              health changes go unnoticed until it is too late. Shonge Achi
              fills this gap by assigning a verified local checker to visit the
              elder on a regular schedule — and automatically alerting the
              family if anything goes wrong.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2a5a4a] mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Our mission is to give every elderly person the dignity of being
              looked after, and every family the peace of mind of knowing their
              loved one is safe — regardless of the distance between them.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-2xl font-bold text-[#2a5a4a] mb-4">
              How We Are Different
            </h2>
            <ul className="text-gray-600 text-lg space-y-4">
              {[
                "We attach wellbeing check-ins to people who are already visiting the household — making the system economically sustainable.",
                "Our AI analyzes patterns across multiple visits, not just single incidents, to catch gradual health deterioration early.",
                "We use an automatic escalation engine that notifies families the moment a visit is missed — no manual follow-up needed.",
                "All checkers are vetted, trained, and assigned within a walkable radius to keep the service reliable and local.",
              ].map((item) => (
                <li key={item} className="flex gap-4 items-start">
                  <span className="text-[#2a7a5a] font-bold text-xl mt-0.5">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-14">
          <Link
            href="/register-elder"
            className="px-10 py-4 bg-[#2a7a5a] text-white rounded-full font-medium text-lg hover:bg-[#1f5e44] transition"
          >
            Register an Elder Today
          </Link>
        </div>
      </div>

      <footer className="bg-[#2a5a4a] text-white/80 text-center py-6 text-sm">
        © 2026 Shonge Achi. All rights reserved.
      </footer>
    </main>
  );
}