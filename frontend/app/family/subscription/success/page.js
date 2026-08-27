"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/app/lib/api";
import { Badge, Card, ErrorMessage } from "@/app/components/ui/AdminUI";

// Where SSLCommerz sends the payer after checkout.
//
// The page does not assume success. Activation normally happens server-side in the
// success callback, but that callback can be missed — SSLCommerz cannot reach a
// localhost ipn_url at all, so during local development it never arrives. So this
// page confirms with /api/subscriptions/verify, which reconciles straight with the
// gateway using its transactionQueryByTransactionId API and activates Premium if the
// money really was taken. Previously it always claimed "Premium active", which could
// be a lie.
export default function SubscriptionSuccess() {
  const tranId = useSearchParams().get("tran");
  const [state, setState] = useState(tranId ? "checking" : "unknown");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tranId) return;
    apiRequest("/api/subscriptions/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tranId })
    })
      .then((body) => {
        setData(body.data);
        const { outcome, subscription } = body.data;
        setState(outcome === "activated" || outcome === "already-active" || subscription.isPremium ? "active" : "pending");
      })
      .catch((err) => { setError(err.message); setState("pending"); });
  }, [tranId]);

  return (
    <main className="checkerMain">
      <p className="eyebrow">Subscription</p>
      <Card>
        {state === "checking" && (
          <>
            <Badge>Confirming</Badge>
            <h1 style={{ fontSize: 22, marginTop: 12 }}>Confirming your payment…</h1>
            <p className="muted">Checking the transaction with the payment gateway.</p>
          </>
        )}

        {state === "active" && (
          <>
            <Badge>Premium active</Badge>
            <h1 style={{ fontSize: 22, marginTop: 12 }}>Payment received</h1>
            <p className="muted">
              Premium is active for {data?.elder?.name ?? "this elder"}
              {data?.subscription?.daysRemaining ? ` for ${data.subscription.daysRemaining} more days` : ""}.
              AI concern metrics, concern trends, wellbeing summaries and customized visit frequency are unlocked.
            </p>
          </>
        )}

        {state === "pending" && (
          <>
            <Badge tone="concern">Not confirmed yet</Badge>
            <h1 style={{ fontSize: 22, marginTop: 12 }}>We couldn&apos;t confirm this payment</h1>
            <p className="muted">
              The gateway hasn&apos;t reported this transaction as settled. If money was taken it will be
              activated automatically once the gateway confirms — nothing is lost. Reload this page in a
              moment, or contact support with the reference below.
            </p>
            {data?.reason && <p className="muted">Gateway said: {data.reason}</p>}
          </>
        )}

        {state === "unknown" && (
          <>
            <Badge>Payment complete</Badge>
            <h1 style={{ fontSize: 22, marginTop: 12 }}>Thanks — your payment was submitted</h1>
            <p className="muted">Open your elders list to see the current plan.</p>
          </>
        )}

        <ErrorMessage message={error} />
        {tranId && <p className="muted" style={{ marginTop: 10 }}>Reference: {tranId}</p>}

        <Link href="/family" className="pillButton" style={{ marginTop: 16 }}>Back to your elders</Link>
      </Card>
    </main>
  );
}
