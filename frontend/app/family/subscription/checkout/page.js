// frontend/app/family/subscription/checkout/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI.js";

const taka = (amount) => `৳${Number(amount).toLocaleString("en-BD")}`;

// Payment options SSLCommerz presents on its hosted page. Listed here so the family
// knows what they can pay with before leaving the app — the actual selection happens
// on the gateway, which is what keeps card details out of this application entirely.
// The families SSLCommerz presents on its hosted page. Shown so the payer knows what
// they can pay with before leaving the app; the choice itself happens on the gateway,
// which is what keeps card and wallet numbers out of this application entirely.
const METHODS = [
  { name: "Mobile banking", detail: "bKash, Nagad, Rocket, upay, MYCash, TAP" },
  { name: "Cards", detail: "Visa, Mastercard, American Express, DBBL Nexus, QCash" },
  { name: "Internet banking", detail: "City Touch, IBBL, MTBL, Bank Asia, AB Direct, EBL Sky and more" }
];

export default function PremiumCheckout() {
  const params = useSearchParams();
  const elderId = params.get("elderId");

  const [elder, setElder] = useState(null);
  const [plans, setPlans] = useState(null);
  const [months, setMonths] = useState(1);
  const [billing, setBilling] = useState({ name: "", email: "", phone: "", address: "", city: "Dhaka", postcode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!elderId) { setError("No elder selected."); setLoading(false); return; }
    Promise.all([
      apiRequest(`/api/subscriptions/status?elderId=${elderId}`),
      apiRequest("/api/subscriptions/plans")
    ])
      .then(([status, planBody]) => {
        setElder(status.data);
        setPlans(planBody.data);
        // Start from the payer's account details and the elder's address; they stay
        // editable because the billing contact may not be the account holder.
        const prefill = status.data.billingPrefill;
        if (prefill) setBilling((current) => ({ ...current, ...prefill, city: prefill.city || "Dhaka" }));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [elderId]);

  const set = (field) => (event) => setBilling((current) => ({ ...current, [field]: event.target.value }));

  // Mirrors the server-side validation in /api/subscriptions/initiate so the button
  // isn't offered before the gateway would accept the details.
  const billingComplete =
    billing.name.trim().length >= 2 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(billing.email.trim()) &&
    /^01[3-9]\d{8}$/.test(billing.phone.replace(/[\s-]/g, "").replace(/^(?:\+?880)/, "0")) &&
    billing.address.trim().length >= 4;

  const pay = async () => {
    setError("");
    setPaying(true);
    try {
      const body = await apiRequest("/api/subscriptions/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderId, months, billing })
      });
      // Hand off to the hosted gateway. Nothing changes on the plan until their
      // callback reaches our backend and the payment validates.
      window.location.assign(body.data.gatewayPageUrl);
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (loading) return <main className="checkerMain"><p className="eyebrow">Subscription</p><p>Loading…</p></main>;

  if (!elder) {
    return (
      <main className="checkerMain">
        <p className="eyebrow">Subscription</p>
        <ErrorMessage message={error} />
        <Link href="/family" className="pillButton">Back to your elders</Link>
      </main>
    );
  }

  const price = plans?.monthlyPriceBDT ?? elder.subscription.monthlyPriceBDT;
  const total = price * months;
  const premium = plans?.plans?.find((plan) => plan.id === "premium");
  const alreadyPremium = elder.subscription.isPremium;
  const paymentsAvailable = plans ? plans.paymentsAvailable : false;

  return (
    <main className="checkerMain">
      <p className="eyebrow">Subscription › Go Premium</p>
      <h1 style={{ fontSize: 26, fontWeight: 700 }}>Go Premium for {elder.elder.name}</h1>
      <p className="subtitle">Review the plan and what you&apos;ll need before paying</p>
      <ErrorMessage message={error} />

      {alreadyPremium && (
        <Card>
          <Badge>Already Premium</Badge>
          <p className="muted" style={{ marginTop: 8 }}>
            This elder is on Premium with {elder.subscription.daysRemaining} day
            {elder.subscription.daysRemaining === 1 ? "" : "s"} remaining. Paying again extends the
            period from its current end date — you won&apos;t lose the days already paid for.
          </p>
        </Card>
      )}

      {/* What you get */}
      <Card>
        <div className="elderItem">
          <strong>Premium plan</strong>
          <span>{taka(price)} <span className="muted">/ month per elder</span></span>
        </div>
        {premium?.features?.map((feature) => (
          <div className="elderItem" key={feature}>
            <span>{feature}</span>
            <Badge>Included</Badge>
          </div>
        ))}
        {premium?.comingSoon?.length > 0 && (
          <>
            <p className="muted" style={{ marginTop: 14 }}>Planned, not yet available:</p>
            {premium.comingSoon.map((feature) => (
              <div className="elderItem" key={feature}>
                <span className="muted">{feature}</span>
                <Badge tone="concern">Coming soon</Badge>
              </div>
            ))}
          </>
        )}
      </Card>

      {/* Billing period */}
      <Card>
        <strong>Billing period</strong>
        <p className="muted">Pay for several months at once if you prefer. Billing is per elder.</p>
        <div className="toolbar" style={{ marginTop: 12 }}>
          {[1, 3, 6, 12].map((option) => (
            <button
              key={option}
              className={`filter ${months === option ? "selected" : ""}`}
              onClick={() => setMonths(option)}
            >
              {option} month{option === 1 ? "" : "s"}
            </button>
          ))}
        </div>
        <div className="elderItem" style={{ marginTop: 12 }}>
          <strong>Total due today</strong>
          <strong>{taka(total)}</strong>
        </div>
        <p className="muted">
          {months} × {taka(price)} · charged once, in BDT. This is not a recurring mandate — Premium
          simply lapses at the end of the period unless you renew.
        </p>
      </Card>

      {/* How you can pay */}
      <Card>
        <strong>Payment methods</strong>
        <p className="muted">
          Payment is handled by SSLCommerz{plans?.gatewayMode === "sandbox" ? " (sandbox / test mode)" : ""}.
          You&apos;ll choose your method on their secure page.
        </p>
        {METHODS.map((method) => (
          <div className="elderItem" key={method.name}>
            <div>
              <strong>{method.name}</strong>
              <p className="muted">{method.detail}</p>
            </div>
          </div>
        ))}
      </Card>

      {/* Billing details sent to the gateway */}
      <Card>
        <strong>Your billing details</strong>
        <p className="muted">
          The gateway needs these to send the payment OTP and your receipt. Card and wallet numbers
          are entered on the gateway itself — Shonge Achi never sees or stores them.
        </p>

        <div className="billingForm">
          <label>
            <span>Full name</span>
            <input value={billing.name} onChange={set("name")} placeholder="Your full name" autoComplete="name" />
          </label>
          <label>
            <span>Email address</span>
            <input type="email" value={billing.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
          </label>
          <label>
            <span>Mobile number</span>
            <input value={billing.phone} onChange={set("phone")} placeholder="01712345678" inputMode="tel" autoComplete="tel" />
            <small className="muted">Used for the bKash / Nagad / card OTP</small>
          </label>
          <label>
            <span>City</span>
            <input value={billing.city} onChange={set("city")} placeholder="Dhaka" autoComplete="address-level2" />
          </label>
          <label className="wide">
            <span>Address</span>
            <input value={billing.address} onChange={set("address")} placeholder="House, road, area" autoComplete="street-address" />
          </label>
          <label>
            <span>Postcode <span className="muted">(optional)</span></span>
            <input value={billing.postcode} onChange={set("postcode")} placeholder="1209" inputMode="numeric" autoComplete="postal-code" />
          </label>
        </div>

        <div className="elderItem" style={{ marginTop: 8 }}>
          <span className="muted">Billed for</span>
          <span>{elder.elder.name} · {taka(total)} BDT</span>
        </div>
      </Card>

      {!billingComplete && (
        <p className="muted">Fill in your name, email, mobile number and address to continue.</p>
      )}

      {!paymentsAvailable && (
        <p className="muted">Online payment is not configured on this server, so checkout is unavailable.</p>
      )}

      <div style={{ marginTop: 18 }}>
        <button className="pillButton" disabled={paying || !paymentsAvailable || !billingComplete} onClick={pay}>
          {paying ? "Opening secure payment…" : `Pay ${taka(total)} with SSLCommerz`}
        </button>
        <Link href="/family" className="pillButton" style={{ marginLeft: 8 }}>Cancel</Link>
      </div>
    </main>
  );
}
