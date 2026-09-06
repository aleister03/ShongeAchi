"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { api } from "@/lib/apiClient";

function formatCurrency(amount, currency = "BDT") {
  const symbol = currency === "BDT" ? "৳" : "$";
  return `${symbol} ${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

// Ported from paymentSandbox-master/app/page.tsx. The sandbox's own
// version builds its "session" purely from URL query params (so the
// caller can set any amount) — here the quote is always fetched fresh
// from the backend (GET /api/payments/quote), which computes the real
// price server-side from lib/subscription.js, so a tampered URL can't
// change what gets charged.
function CheckoutInner() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: sessionAuth, status } = useSession();
  const months = Number(searchParams.get("months")) || 1;

  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("bkash");

  const familyMemberId = sessionAuth?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    api
      .get(`/api/payments/quote?elderId=${id}&familyMemberId=${familyMemberId}&months=${months}`)
      .then((res) => setQuote(res.data))
      .catch((err) => setError(err.message || "Couldn't load payment details."))
      .finally(() => setLoading(false));
  }, [id, familyMemberId, months, status]);

  function proceed() {
    if (!quote) return;
    const params = new URLSearchParams({
      familyMemberId,
      months: String(months),
      sessionId: quote.sessionId,
      invoiceNumber: quote.invoiceNumber,
    });
    router.push(`/elder/${id}/subscription/checkout/${method}?${params.toString()}`);
  }

  if (loading || status === "loading") {
    return (
      <main className="flex items-center justify-center py-24">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </main>
    );
  }

  if (error || !quote) {
    return (
      <main className="flex items-center justify-center py-24">
        <p className="text-error">{error || "Couldn't load payment details."}</p>
      </main>
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-8">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 flex flex-col gap-2">
          <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-6 h-full shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-surface-container-highest">
            <div>
              <h2 className="text-title-md text-on-surface mb-2">Payment Summary</h2>
              <p className="text-body-md text-on-surface-variant">Review your transaction details before proceeding.</p>
            </div>
            <div className="flex-grow flex flex-col gap-4">
              <div className="bg-surface-container rounded-lg p-4 flex flex-col gap-1">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Plan</span>
                <span className="text-title-md text-on-surface">{quote.plan.name}</span>
              </div>
              <div className="bg-surface-container rounded-lg p-4 flex flex-col gap-1">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Elder</span>
                <span className="text-body-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  {quote.elderName}
                </span>
              </div>
              <div className="bg-surface-container rounded-lg p-4 flex flex-col gap-1">
                <span className="text-label-sm text-on-surface-variant uppercase tracking-wider">Invoice</span>
                <span className="text-body-md text-on-surface">#{quote.invoiceNumber}</span>
              </div>
            </div>
            <div className="mt-auto pt-6 border-t border-surface-container-highest">
              <div className="flex justify-between items-end mb-2">
                <span className="text-body-md text-on-surface-variant">Subtotal</span>
                <span className="text-body-md text-on-surface">{formatCurrency(quote.amount, quote.currency)}</span>
              </div>
              <div className="flex justify-between items-end mb-4">
                <span className="text-body-md text-on-surface-variant">Processing Fee</span>
                <span className="text-body-md text-on-surface">{formatCurrency(0, quote.currency)}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-surface-container">
                <span className="text-body-lg text-on-surface-variant">Total Amount</span>
                <span className="text-headline-lg text-primary">{formatCurrency(quote.amount, quote.currency)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col">
          <div className="bg-surface-container-lowest rounded-xl p-6 flex flex-col gap-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-surface-container-highest">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">security</span>
              <h2 className="text-headline-lg-mobile md:text-headline-lg text-on-surface">Select Payment Method</h2>
            </div>
            <p className="text-body-md text-on-surface-variant">
              Choose your preferred secure payment option.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { id: "bkash", label: "bKash Wallet", badge: "Popular" },
                { id: "nagad", label: "Nagad Account" },
                { id: "card", label: "Card Payment" },
              ].map((opt) => (
                <label key={opt.id} className="relative cursor-pointer group">
                  <input
                    checked={method === opt.id}
                    className="payment-radio peer sr-only"
                    name="payment_method"
                    type="radio"
                    value={opt.id}
                    onChange={() => setMethod(opt.id)}
                  />
                  <div className="w-full border-2 border-surface-container-highest rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:border-primary-container bg-surface-container-lowest">
                    <div className="radio-indicator relative w-6 h-6 rounded-full border-2 border-outline-variant flex-shrink-0 transition-colors" />
                    <div className="w-16 h-12 flex items-center justify-center">
                      {opt.id === "bkash" && <img src="/assets/bkash Logo.png" alt="bKash Logo" className="max-h-full max-w-full object-contain" />}
                      {opt.id === "nagad" && <img src="/assets/nagad Logo.png" alt="Nagad Logo" className="max-h-full max-w-full object-contain" />}
                      {opt.id === "card" && <span className="material-symbols-outlined text-5xl text-outline">credit_card</span>}
                    </div>
                    <span className="text-title-md text-on-surface flex-grow">{opt.label}</span>
                    {opt.badge && (
                      <span className="text-label-sm text-bkash-pink font-bold bg-pink-50 px-3 py-1 rounded-full">{opt.badge}</span>
                    )}
                  </div>
                </label>
              ))}

              <div className="mt-4 pt-6 border-t border-surface-container-highest flex flex-col sm:flex-row justify-end gap-3">
                <button
                  className="px-8 h-12 rounded-full border border-outline-variant font-bold text-label-bold text-outline hover:bg-surface-container transition-colors"
                  type="button"
                  onClick={() => router.back()}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#008b94] hover:bg-primary text-on-primary text-title-md h-12 px-8 rounded-full transition-all duration-200 shadow-[0_4px_12px_rgba(0,139,148,0.2)] hover:shadow-[0_6px_16px_rgba(0,139,148,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  type="button"
                  onClick={proceed}
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  Proceed to Pay {formatCurrency(quote.amount, quote.currency)}
                </button>
              </div>
            </div>

            <div className="bg-error-container text-on-error-container p-3 rounded-lg text-center text-label-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span>
              Sandbox Environment - No real funds will be deducted.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center py-24">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </main>
      }
    >
      <CheckoutInner />
    </Suspense>
  );
}
