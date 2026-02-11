"use client";

import { useEffect, useState } from "react";

type Quote = { symbol: string; price: number; change: number; changePercent: number };

export default function ClientQuote({ symbol }: { symbol: string }) {
  const [q, setQ] = useState<Quote | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setErr(null);
      const res = await fetch(`/api/quote?symbol=${symbol}`);
      const json = await res.json();
      if (!res.ok) {
        if (!cancelled) setErr(json?.error || "Failed");
        return;
      }
      if (!cancelled) setQ(json);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [symbol]);

  if (err) return <div style={{ fontSize: 12, color: "#a00" }}>{err}</div>;
  if (!q) return <div style={{ fontSize: 12, color: "#666" }}>Loading…</div>;

  const sign = q.change >= 0 ? "+" : "";
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontWeight: 800, fontSize: 18, color: "#e5e7eb" }}>${q.price.toFixed(2)}</div>
      <div style={{ fontSize: 12, color: q.change >= 0 ? "#22c55e" : "#ef4444" }}>
        {sign}
        {q.change.toFixed(2)} ({sign}
        {q.changePercent.toFixed(2)}%)
      </div>
    </div>
  );
}
