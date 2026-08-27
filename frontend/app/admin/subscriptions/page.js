"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api.js";
import { Badge, ErrorMessage } from "@/app/components/ui/AdminUI.js";
import { formatAddress } from "@/app/lib/address.js";

const taka = (amount, currency = "BDT") =>
  currency === "BDT" ? `৳${Number(amount).toLocaleString("en-BD")}` : `${Number(amount).toLocaleString()}`;

const PAYMENT_TONE = { paid: "", failed: "danger", cancelled: "concern", initiated: "warn" };

// Backs the "Subscriptions" nav link, which previously 404'd.
export default function AdminSubscriptionsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/api/subscriptions/overview")
      .then((body) => setData(body.data))
      .catch((err) => setError(err.message));
  }, []);

  if (!data) {
    return <main className="checkerMain"><h1>Subscriptions</h1>{error ? <ErrorMessage message={error} /> : <p className="subtitle">Loading…</p>}</main>;
  }

  const { summary, elders, payments } = data;
  const premiumElders = elders.filter((elder) => elder.subscription.isPremium);

  return (
    <main className="checkerMain">
      <h1>Subscriptions</h1>
      <p className="subtitle">Premium plans across the platform and recent payment activity</p>
      <ErrorMessage message={error} />

      <section className="stats">
        <div className="card stat"><span>Premium subscribers</span><strong>{summary.premiumSubscribers} <small>of {summary.totalElders}</small></strong></div>
        <div className="card stat"><span>Monthly price</span><strong>{taka(summary.monthlyPriceBDT)}</strong></div>
        <div className="card stat"><span>Active monthly value</span><strong>{taka(summary.activeMonthlyValue)}</strong></div>
        <div className="card stat"><span>Collected to date</span><strong>{taka(summary.collected)}</strong></div>
      </section>

      <div className="tableWrap" style={{ marginBottom: 24 }}>
        <table className="checkerTable">
          <thead><tr><th>PREMIUM ELDER</th><th>RENEWS</th><th>DAYS LEFT</th><th>STATUS</th></tr></thead>
          <tbody>
            {premiumElders.map((elder) => (
              <tr key={elder._id}>
                <td><strong>{elder.name}</strong><p className="muted">{formatAddress(elder.address)}</p></td>
                <td>{elder.subscription.currentPeriodEnd ? new Date(elder.subscription.currentPeriodEnd).toLocaleDateString() : "—"}</td>
                <td>{elder.subscription.daysRemaining}</td>
                <td><Badge>Active</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!premiumElders.length && <p className="empty">No elders are on Premium yet.</p>}
      </div>

      <div className="tableWrap">
        <table className="checkerTable">
          <thead><tr><th>PAYMENT</th><th>ELDER</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr></thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.tranId}>
                <td><span className="muted">{payment.tranId}</span></td>
                <td>{payment.elderName}</td>
                <td>{taka(payment.amount, payment.currency)} <span className="muted">· {payment.months} mo</span></td>
                <td>
                  <Badge tone={PAYMENT_TONE[payment.status] ?? ""}>{payment.status}</Badge>
                  {payment.failureReason && <p className="muted">{payment.failureReason}</p>}
                </td>
                <td>{new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!payments.length && <p className="empty">No payment attempts recorded yet.</p>}
      </div>
    </main>
  );
}
