"use client";
import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/apiClient";

function formatCurrency(amount, currency = "BDT") {
  const symbol = currency === "BDT" ? "৳" : "$";
  return `${symbol} ${Number(amount).toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

function formatCardNumber(value) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

// Ported from paymentSandbox-master/app/pay/card/page.tsx.
function CardInner() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const familyMemberId = searchParams.get("familyMemberId");
  const months = searchParams.get("months");
  const sessionId = searchParams.get("sessionId");
  const invoiceNumber = searchParams.get("invoiceNumber");

  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 13) {
      setError("Please enter a valid card number.");
      return;
    }
    if (expiryDate.length !== 5) {
      setError("Please enter a valid expiry date (MM/YY).");
      return;
    }
    if (cvv.length < 3) {
      setError("Please enter a valid CVV.");
      return;
    }
    if (!cardHolderName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post("/api/payments/record", {
        elderId: id,
        familyMemberId,
        months: Number(months),
        sessionId,
        invoiceNumber,
        method: "card",
        details: { cardNumber, expiryDate, cvv, cardHolderName: cardHolderName.trim() },
      });
      router.push(`/subscription/success?paymentId=${res.data.paymentId}`);
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  const backHref = `/elder/${id}/subscription/checkout?months=${months || 1}`;

  return (
    <main className="flex-grow w-full flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-lg mx-auto">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-brand-teal mb-4">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Payment
        </Link>
        <header className="text-center mb-8">
          <h1 className="text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Secure Checkout</h1>
          <p className="text-body-md text-on-surface-variant flex items-center justify-center gap-2">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            Shonge Achi Secure Sandbox Environment
          </p>
        </header>
        <div className="bg-white rounded-2xl p-6 border border-[#EAE6D1] shadow-[0px_8px_24px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-variant">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Invoice</p>
              <p className="text-title-md text-on-surface">#{invoiceNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <img src="/assets/visa logo.png" alt="Visa" className="h-8 object-contain" />
              <img src="/assets/mastercard logo.png" alt="Mastercard" className="h-8 object-contain" />
            </div>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-1">
              <label className="block font-bold text-label-bold text-on-surface" htmlFor="cardNumber">
                Card Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined">credit_card</span>
                </span>
                <input
                  className="secure-input block w-full pl-10 pr-3 py-3 text-body-md text-on-surface placeholder-outline-variant"
                  id="cardNumber"
                  maxLength={19}
                  placeholder="0000 0000 0000 0000"
                  required
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block font-bold text-label-bold text-on-surface" htmlFor="expiryDate">
                  Expiry Date
                </label>
                <input
                  className="secure-input block w-full px-3 py-3 text-body-md text-on-surface placeholder-outline-variant text-center"
                  id="expiryDate"
                  maxLength={5}
                  placeholder="MM/YY"
                  required
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiry(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <label className="block font-bold text-label-bold text-on-surface" htmlFor="cvv">
                  CVV
                </label>
                <input
                  className="secure-input block w-full px-3 py-3 text-body-md text-on-surface placeholder-outline-variant text-center tracking-widest"
                  id="cvv"
                  maxLength={4}
                  placeholder="•••"
                  required
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block font-bold text-label-bold text-on-surface" htmlFor="cardName">
                Name on Card
              </label>
              <input
                className="secure-input block w-full px-3 py-3 text-body-md text-on-surface placeholder-outline-variant uppercase"
                id="cardName"
                placeholder="Cardholder Name"
                required
                type="text"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-error">{error}</p>}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href={backHref} className="flex-1 sm:flex-none px-8 h-12 rounded-full border border-outline-variant font-bold text-label-bold text-outline hover:bg-surface-container flex items-center justify-center">
                Cancel
              </Link>
              <button
                className="flex-1 bg-primary hover:bg-primary-container text-on-primary text-title-md py-4 rounded-full flex items-center justify-center gap-2 h-12 shadow-sm active:scale-[0.98] disabled:opacity-80"
                type="submit"
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">lock</span>
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <p className="mt-8 text-center text-label-sm text-on-surface-variant">
          This is a sandbox environment. <strong className="text-error">Do not use real card details.</strong>
        </p>
      </div>
    </main>
  );
}

export default function CardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center py-24">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </main>
      }
    >
      <CardInner />
    </Suspense>
  );
}
