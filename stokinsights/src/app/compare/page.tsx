"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SYMBOLS } from "@/lib/symbols";

type Quote = { symbol: string; price: number; change: number; changePercent: number };

async function fetchQuote(symbol: string): Promise<Quote> {
  const res = await fetch(`/api/quote?symbol=${symbol}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Failed");
  return json;
}

export default function ComparePage() {
  const [a, setA] = useState("AAPL");
  const [b, setB] = useState("MSFT");
  const [qa, setQa] = useState<Quote | null>(null);
  const [qb, setQb] = useState<Quote | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const options = useMemo(
    () => SYMBOLS.map((s) => <option key={s.symbol} value={s.symbol}>{s.symbol}</option>),
    []
  );

  async function runCompare() {
    setErr(null);
    setQa(null);
    setQb(null);
    try {
      const [ra, rb] = await Promise.all([fetchQuote(a), fetchQuote(b)]);
      setQa(ra);
      setQb(rb);
    } catch (e: any) {
      setErr(e.message || "Compare failed");
    }
  }

  return (
    <main style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 26 }}>Compare</h1>
      <div style={{ marginBottom: 10 }}>
        <Link href="/">← Back</Link>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select value={a} onChange={(e) => setA(e.target.value)}>{options}</select>
        <span>vs</span>
        <select value={b} onChange={(e) => setB(e.target.value)}>{options}</select>

        <button
          onClick={runCompare}
          style={{
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Compare
        </button>
      </div>

      {err && <div style={{ marginTop: 10, color: "#a00" }}>{err}</div>}

      {(qa || qb) && (
        <div style={{ marginTop: 14, border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8 }}>Metric</th>
                <th style={{ textAlign: "left", padding: 8 }}>{qa?.symbol ?? a}</th>
                <th style={{ textAlign: "left", padding: 8 }}>{qb?.symbol ?? b}</th>
              </tr>
            </thead>
            <tbody>
              <Row label="Price" a={qa ? `$${qa.price.toFixed(2)}` : "—"} b={qb ? `$${qb.price.toFixed(2)}` : "—"} />
              <Row
                label="Change %"
                a={qa ? `${qa.changePercent.toFixed(2)}%` : "—"}
                b={qb ? `${qb.changePercent.toFixed(2)}%` : "—"}
              />
            </tbody>
          </table>

          <div style={{ marginTop: 10, color: "#666", fontSize: 13 }}>
            Next: add fundamentals + GenAI summary (“A is valued higher, B has stronger momentum…”).
          </div>
        </div>
      )}
    </main>
  );
}

function Row({ label, a, b }: { label: string; a: string; b: string }) {
  return (
    <tr>
      <td style={{ padding: 8, borderTop: "1px solid #eee" }}>{label}</td>
      <td style={{ padding: 8, borderTop: "1px solid #eee" }}>{a}</td>
      <td style={{ padding: 8, borderTop: "1px solid #eee" }}>{b}</td>
    </tr>
  );
}
