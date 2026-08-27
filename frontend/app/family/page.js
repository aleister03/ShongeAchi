// frontend/app/family/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";

const taka = (amount) => `৳${Number(amount).toLocaleString("en-BD")}`;

export default function FamilyHome() {
  const [elders, setElders] = useState(null);
  const [plans, setPlans] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/elders")
      .then((body) => setElders(body.data))
      .catch((err) => setError(err.message));
    // Price and availability come from the API so the button never quotes a figure
    // the server would not charge.
    apiRequest("/api/subscriptions/plans")
      .then((body) => setPlans(body.data))
      .catch(() => setPlans(null));
  }, []);

  if (!elders) return <main className="checkerMain">{error ? <ErrorMessage message={error} /> : "Loading…"}</main>;

  const price = plans?.monthlyPriceBDT;
  const paymentsAvailable = plans ? plans.paymentsAvailable : true;

  return (
    <main className="checkerMain">
      <p className="eyebrow">Your Elders</p>
      <ErrorMessage message={error} />

      {elders.map((elder) => {
        const subscription = elder.subscription ?? { plan: "free", isPremium: false };
        return (
          <Card key={elder._id} className="elderItem">
            <strong>{elder.name}</strong>
            <p className="muted">{formatAddress(elder.address)}</p>

            <p style={{ marginTop: 8 }}>
              {subscription.isPremium ? (
                <>
                  <Badge>Premium</Badge>{" "}
                  <span className="muted">
                    {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? "" : "s"} remaining
                  </span>
                </>
              ) : (
                <>
                  <Badge tone={subscription.expired ? "concern" : ""}>
                    {subscription.expired ? "Premium expired" : "Free"}
                  </Badge>{" "}
                  {price && <span className="muted">Premium is {taka(price)} / month</span>}
                </>
              )}
            </p>

            <Link href={`/family/elders/${elder._id}/wellbeing`} className="pillButton">
              View Wellbeing Report
            </Link>

            <Link
              href={`/family/subscription/checkout?elderId=${elder._id}`}
              className="pillButton"
              style={{ marginLeft: 8 }}
            >
              {subscription.isPremium
                ? "Manage Premium"
                : subscription.expired ? "Renew Premium" : "Go Premium"}
            </Link>
          </Card>
        );
      })}

      {!paymentsAvailable && (
        <p className="muted">Online payment is not configured on this server, so upgrades are unavailable.</p>
      )}

      {!elders.length && (
        <p className="empty">No elders registered yet. <Link href="/register-elder">Register one</Link>.</p>
      )}
    </main>
  );
}
