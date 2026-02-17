"use client";

import { useEffect, useMemo, useState } from "react";
import CompareChart from "@/components/CompareChart";
import { SYMBOLS } from "@/lib/symbols";
import type { HistoryPoint } from "@/lib/metrics";
import { useSearchParams } from "next/navigation";
import {
  computeCorrelation,
  computeMaxDrawdownPct,
  computeReturnPct,
  computeVolatilityPct,
} from "@/lib/metrics";

type Quote = {
  price: number;
  change: number;
  changePercent: number;
};

type Signal = {
  direction: "UP" | "DOWN" | "NEUTRAL";
  confidence: number; // 0..100
  bullets?: string[];
};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error((data as any)?.error || "Request failed");
  return data as T;
}

export default function CompareClient() {
  const [left, setLeft] = useState("AAPL");
  const [right, setRight] = useState("MSFT");
  const [range, setRange] = useState<"1W" | "3M" | "1Y" | "5Y">("1Y");

  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [leftHist, setLeftHist] = useState<HistoryPoint[]>([]);
  const [rightHist, setRightHist] = useState<HistoryPoint[]>([]);
  const [leftQuote, setLeftQuote] = useState<Quote | null>(null);
  const [rightQuote, setRightQuote] = useState<Quote | null>(null);
  const [leftSig, setLeftSig] = useState<Signal | null>(null);
  const [rightSig, setRightSig] = useState<Signal | null>(null);

  const options = useMemo(() => SYMBOLS, []);

  // Read query params once on mount: /compare?left=AAPL&right=MSFT&range=1Y
  useEffect(() => {
    const l = searchParams.get("left");
    const r = searchParams.get("right");
    const rangeParam = searchParams.get("range");

    if (l) setLeft(l.toUpperCase());
    if (r) setRight(r.toUpperCase());
    if (rangeParam && ["1W", "3M", "1Y", "5Y"].includes(rangeParam)) {
      setRange(rangeParam as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load compare data when left/right/range changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const [qL, qR, hL, hR, sL, sR] = await Promise.all([
          fetchJSON<Quote>(`/api/quote?symbol=${left}`),
          fetchJSON<Quote>(`/api/quote?symbol=${right}`),
          fetchJSON<HistoryPoint[]>(`/api/history?symbol=${left}&range=${range}`),
          fetchJSON<HistoryPoint[]>(`/api/history?symbol=${right}&range=${range}`),
          fetchJSON<Signal>(`/api/predict?symbol=${left}`),
          fetchJSON<Signal>(`/api/predict?symbol=${right}`),
        ]);

        if (cancelled) return;

        setLeftQuote(qL);
        setRightQuote(qR);
        setLeftHist(hL);
        setRightHist(hR);
        setLeftSig(sL);
        setRightSig(sR);
      } catch (e: any) {
        if (!cancelled) setErr(e.message || "Failed to load compare data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [left, right, range]);

  const metrics = useMemo(() => {
    if (!leftHist.length || !rightHist.length) return null;

    const retL = computeReturnPct(leftHist);
    const retR = computeReturnPct(rightHist);

    const volL = computeVolatilityPct(leftHist);
    const volR = computeVolatilityPct(rightHist);

    const ddL = computeMaxDrawdownPct(leftHist);
    const ddR = computeMaxDrawdownPct(rightHist);

    const corr = computeCorrelation(leftHist, rightHist);

    return { retL, retR, volL, volR, ddL, ddR, corr };
  }, [leftHist, rightHist]);

  const fmtPct = (x: number) => `${x.toFixed(2)}%`;
  const fmtNum = (x: number) => x.toFixed(2);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold tracking-tight">Compare</div>
        </div>
        <a
          href="/"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back
        </a>
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <div className="mb-1 text-xs font-bold text-zinc-300">Left</div>
            <select
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-400/40"
            >
              {options.map((o) => (
                <option key={o.symbol} value={o.symbol} className="bg-zinc-900">
                  {o.symbol} — {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 text-xs font-bold text-zinc-300">Right</div>
            <select
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-sky-400/40"
            >
              {options.map((o) => (
                <option key={o.symbol} value={o.symbol} className="bg-zinc-900">
                  {o.symbol} — {o.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-1 text-xs font-bold text-zinc-300">Range</div>
            <div className="flex flex-wrap gap-2">
              {(["1W", "3M", "1Y", "5Y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={[
                    "rounded-full px-3 py-2 text-xs font-bold border transition",
                    r === range
                      ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10",
                  ].join(" ")}
                >
                  {r}
                </button>
              ))}

              <button
                onClick={() => {
                  setLeft(right);
                  setRight(left);
                }}
                className="ml-auto rounded-full px-3 py-2 text-xs font-bold border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
              >
                Swap
              </button>
            </div>
          </div>
        </div>

        {err && <div className="mt-3 text-sm text-red-400">{err}</div>}
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold">{left}</div>
            {leftQuote ? (
              <div className="text-right">
                <div className="text-xl font-extrabold">${fmtNum(leftQuote.price)}</div>
                <div className={leftQuote.change >= 0 ? "text-emerald-300 text-sm" : "text-red-300 text-sm"}>
                  {leftQuote.change >= 0 ? "+" : ""}
                  {fmtNum(leftQuote.change)} ({leftQuote.changePercent >= 0 ? "+" : ""}
                  {fmtPct(leftQuote.changePercent)})
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-400">Loading quote…</div>
            )}
          </div>

          <div className="mt-3 text-sm text-zinc-300">
            <div className="font-bold text-zinc-200">AI Signal</div>
            {leftSig ? (
              <div className="mt-1 text-zinc-300">
                {leftSig.direction} • Confidence {leftSig.confidence}%
              </div>
            ) : (
              <div className="text-zinc-400">Loading…</div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div className="text-lg font-extrabold">{right}</div>
            {rightQuote ? (
              <div className="text-right">
                <div className="text-xl font-extrabold">${fmtNum(rightQuote.price)}</div>
                <div className={rightQuote.change >= 0 ? "text-emerald-300 text-sm" : "text-red-300 text-sm"}>
                  {rightQuote.change >= 0 ? "+" : ""}
                  {fmtNum(rightQuote.change)} ({rightQuote.changePercent >= 0 ? "+" : ""}
                  {fmtPct(rightQuote.changePercent)})
                </div>
              </div>
            ) : (
              <div className="text-sm text-zinc-400">Loading quote…</div>
            )}
          </div>

          <div className="mt-3 text-sm text-zinc-300">
            <div className="font-bold text-zinc-200">AI Signal</div>
            {rightSig ? (
              <div className="mt-1 text-zinc-300">
                {rightSig.direction} • Confidence {rightSig.confidence}%
              </div>
            ) : (
              <div className="text-zinc-400">Loading…</div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {loading ? (
          <div className="text-sm text-zinc-400">Loading chart…</div>
        ) : leftHist.length && rightHist.length ? (
          <CompareChart leftSymbol={left} rightSymbol={right} left={leftHist} right={rightHist} />
        ) : (
          <div className="text-sm text-zinc-400">No data to chart.</div>
        )}
      </div>

      {/* Metrics */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-lg font-extrabold">Key Metrics ({range})</div>

        <div className="mt-3 overflow-x-auto">
          <table className="min-w-[520px] w-full text-sm">
            <thead className="text-zinc-400">
              <tr className="border-b border-white/10">
                <th className="py-2 text-left font-bold">Metric</th>
                <th className="py-2 text-right font-bold">{left}</th>
                <th className="py-2 text-right font-bold">{right}</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              <tr className="border-b border-white/5">
                <td className="py-2">Return</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.retL) : "—"}</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.retR) : "—"}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Daily Volatility (stdev)</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.volL) : "—"}</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.volR) : "—"}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2">Max Drawdown</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.ddL) : "—"}</td>
                <td className="py-2 text-right">{metrics ? fmtPct(metrics.ddR) : "—"}</td>
              </tr>
              <tr>
                <td className="py-2">
                  Correlation (daily returns)
                  <div className="text-xs text-zinc-500">Same for both — relationship metric</div>
                </td>
                <td className="py-2 text-right" colSpan={2}>
                  {metrics ? metrics.corr.toFixed(3) : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-xs text-zinc-500">
          Note: Metrics are computed from historical close prices for the selected range.
        </div>
      </div>
    </div>
  );
}
