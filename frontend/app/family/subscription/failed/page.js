"use client";
import Link from "next/link";
import { Badge, Card } from "@/app/components/ui/AdminUI.js";

export default function SubscriptionFailed() {
  return (
    <main className="checkerMain">
      <p className="eyebrow">Subscription</p>
      <Card>
        <Badge tone="concern">Payment not completed</Badge>
        <h1 style={{ fontSize: 22, marginTop: 12 }}>The payment did not go through</h1>
        <p className="muted">
          Nothing has been charged and the plan is unchanged. This can happen if the card was
          declined or the session timed out — you can try again from your elders list.
        </p>
        <Link href="/family" className="pillButton" style={{ marginTop: 16 }}>Back to your elders</Link>
      </Card>
    </main>
  );
}
