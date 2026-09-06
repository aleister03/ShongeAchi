"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/apiClient";

// CHANGED: with SSLCommerz, activation happened in a server-to-server
// callback and this page just reconciled/confirmed it. The payment
// gateway is now a local sandbox (bKash/Nagad/Card simulator) where
// POST /api/payments/record both creates the record AND activates the
// subscription in one step (see backend/app/api/payments/record/route.js)
// — so this page just displays the record that step already returned,
// rather than calling a separate verify endpoint.
function SuccessContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const paymentId = searchParams.get("paymentId");
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      setLoading(false);
      return;
    }
    const familyMemberId = session?.user?.id || "demo-family-1";
    api
      .get(`/api/payments/record/${paymentId}?familyMemberId=${familyMemberId}`)
      .then((res) => setRecord(res.data))
      .catch((err) => setError(err.message || "Couldn't load this payment."))
      .finally(() => setLoading(false));
  }, [paymentId, session]);

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <Image src="/logo.png" alt="Shonge Achi Logo" width={40} height={40} />
          <span className="text-xl font-semibold text-[#2a7a5a]">Shonge Achi</span>
        </div>
        {loading ? (
          <p className="text-gray-500">Loading…</p>
        ) : error ? (
          <>
            <h1 className="text-xl font-bold text-amber-600 mb-2">Payment received</h1>
            <p className="text-sm text-gray-500 mb-6">
              We couldn't load the payment details just now, but if you completed checkout, Premium should already
              be active — check the elder's Subscription tab.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[#2a5a4a] mb-2">Premium activated 🎉</h1>
            <p className="text-sm text-gray-500 mb-2">
              ৳{record?.totalAmount} paid via {record?.method?.toUpperCase()} · invoice #{record?.invoiceNumber}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {record?.months} month{record?.months === 1 ? "" : "s"} of Premium is now active.
            </p>
          </>
        )}
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

export default function SubscriptionSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
