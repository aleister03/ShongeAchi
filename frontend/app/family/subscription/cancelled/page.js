"use client";
import Link from "next/link";
import { Badge, Card } from "@/app/components/ui/AdminUI.js";

export default function SubscriptionCancelled() {
  return (
    <main className="checkerMain">
      <p className="eyebrow">Subscription</p>
      <Card>
        <Badge tone="concern">Cancelled</Badge>
        <h1 style={{ fontSize: 22, marginTop: 12 }}>Payment cancelled</h1>
        <p className="muted">
          You cancelled before paying, so nothing was charged and the elder stays on the Free plan.
        </p>
        <Link href="/family" className="pillButton" style={{ marginTop: 16 }}>Back to your elders</Link>
      </Card>
    </main>
  );
}
