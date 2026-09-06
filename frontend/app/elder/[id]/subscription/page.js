"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ElderNavbar from "@/app/components/ElderNavbar";
import { api } from "@/lib/apiClient";

export default function SubscriptionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [elder, setElder] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/signin?callbackUrl=/elder/${id}/subscription`);
    }
  }, [status, router, id]);

  const familyMemberId = session?.user?.id || "demo-family-1";

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      api.get(`/api/elders/${id}?familyMemberId=${familyMemberId}`),
      api.get(`/api/subscriptions/status?elderId=${id}&familyMemberId=${familyMemberId}`),
      api.get(`/api/subscriptions/plans`),
    ])
      .then(([elderRes, statusRes, plansRes]) => {
        setElder(elderRes.data);
        setSubscription(statusRes.data.subscription);
        setPayments(statusRes.data.payments || []);
        setPlans(plansRes.data);
      })
      .catch((err) => setError(err.message || "Couldn't load subscription details."))
      .finally(() => setLoading(false));
  }, [id, status, familyMemberId]);

  // CHANGED: this used to be a billing-details form that posted straight
  // to SSLCommerz's initiate route and redirected to their hosted
  // gateway. The payment gateway is now a local bKash/Nagad/Card sandbox
  // simulator (see paymentSandbox-master) — "checkout" is now its own
  // page (method selection, then one of three fake payment forms) rather
  // than a form on this page, so this just navigates there with the
  // chosen number of months.
  function goToCheckout() {
    router.push(`/elder/${id}/subscription/checkout?months=${months}`);
  }

  if (status === "loading" || status === "unauthenticated" || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#FBF3D9" }}>
        <p className="text-[#2a5a4a] text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "#FBF3D9" }}>
      <ElderNavbar elderId={id} active="subscription" />
      <div className="px-10 py-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#2a5a4a] mb-6">{elder?.name} — Subscription</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-500">Current plan</p>
              <p className="text-2xl font-bold text-gray-900">{subscription?.isPremium ? "Premium" : "Free"}</p>
            </div>
            {subscription?.isPremium && (
              <span className="px-4 py-1.5 rounded-full bg-[#d9e9e4] text-[#2a5a4a] text-sm font-semibold">
                {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? "" : "s"} remaining
              </span>
            )}
          </div>
          {subscription?.isPremium && (
            <p className="text-sm text-gray-500">
              Renews or expires on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
            </p>
          )}
          {subscription?.expired && (
            <p className="text-sm text-amber-600">Your Premium subscription has expired — renew below to restore access.</p>
          )}
        </div>

        {(!subscription?.isPremium || subscription?.expired) && plans && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-2">Upgrade to Premium</h2>
            <p className="text-sm text-gray-500 mb-4">
              ৳{plans.monthlyPriceBDT} / month per elder. Unlocks AI concern metrics, concern trends over time,
              direct family-checker messaging, and customized visit frequency.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Months</label>
              <select
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {[1, 3, 6, 12].map((m) => (
                  <option key={m} value={m}>
                    {m} month{m === 1 ? "" : "s"} (৳{plans.monthlyPriceBDT * m})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={goToCheckout}
              className="w-full py-3 rounded-full bg-[#2a7a5a] text-white text-sm font-medium hover:bg-[#1f5e44] transition"
            >
              Continue to payment — ৳{plans.monthlyPriceBDT * months}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Sandbox mode — no real money will be charged.
            </p>
          </div>
        )}

        {payments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Payment history</h2>
            <div className="space-y-2">
              {payments.map((p) => (
                <div key={p.paymentId} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                  <span className="text-gray-800">
                    ৳{p.amount} · {p.months} mo · {p.method}
                  </span>
                  <span
                    className={`font-medium ${
                      p.status === "success" ? "text-green-600" : p.status === "pending" ? "text-gray-400" : "text-red-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
