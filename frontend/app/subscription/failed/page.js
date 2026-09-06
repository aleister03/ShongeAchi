"use client";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

function FailedContent() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Image src="/logo.png" alt="Shonge Achi Logo" width={40} height={40} />
          <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
        </div>
        <h1 className="text-xl font-bold text-red-500 mb-2">Payment didn't go through</h1>
        <p className="text-sm text-gray-500 mb-6">
          Nothing was charged. You can try again from the elder's Subscription tab.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#1f5e44] transition"
        >
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

export default function SubscriptionFailedPage() {
  return (
    <Suspense>
      <FailedContent />
    </Suspense>
  );
}
