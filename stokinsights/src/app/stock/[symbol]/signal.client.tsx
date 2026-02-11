"use client";

import { useEffect, useState } from "react";

type Signal = {
  symbol: string;
  direction: "UP" | "DOWN";
  probUp: number;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  updatedAt: string;
};

export default function SignalCard({ symbol }: { symbol: string }) {
  const [s, setS] = useState<Signal | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setErr(null);
      const res = await fetch(`/api/predict?symbol=${symbol}`);
      const json = await res.json();
      if (!res.ok) {
        if (!cancelled) setErr(json?.error || "Failed");
        return;
      }
      if (!cancelled) setS(json);
    }
    run();
    return () => { cancelled = true; };
  }, [symbol]);

  return (
    <div
      style={{
        border: "1px solid #1f2937",
        borderRadius: 16,
        padding: 14,
        background: "#0b0f14",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 800, color: "#e5e7eb" }}>AI Signal (experimental)</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            For curiosity only — not advice
          </div>
        </div>

        {s && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 900, fontSize: 18, color: "#e5e7eb" }}>
              {s.direction === "UP" ? "⬆" : "⬇"} {(s.probUp * 100).toFixed(0)}%
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>Confidence: {s.confidence}</div>
          </div>
        )}
      </div>

      {err && <div style={{ marginTop: 8, color: "#ef4444", fontSize: 12 }}>{err}</div>}
      {!err && !s && <div style={{ marginTop: 8, color: "#9ca3af", fontSize: 12 }}>Loading…</div>}

      {s && (
        <ul style={{ marginTop: 10, paddingLeft: 18, color: "#d1d5db", fontSize: 13 }}>
          {s.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
