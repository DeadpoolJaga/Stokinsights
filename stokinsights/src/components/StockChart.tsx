"use client";

import { useEffect, useRef, useState } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeries,
  Time,
} from "lightweight-charts";

type Point = { time: number; close: number };

export default function StockChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [range, setRange] = useState<"1D" | "1W" | "3M" | "1Y" | "5Y">("1Y");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight || 360,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255,255,255,0.85)",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.06)" },
        horzLines: { color: "rgba(255,255,255,0.06)" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.10)" },
      timeScale: { borderColor: "rgba(255,255,255,0.10)" },
      crosshair: {
        vertLine: { color: "rgba(255,255,255,0.15)" },
        horzLine: { color: "rgba(255,255,255,0.15)" },
      },
    });

    // ✅ v5 API: addSeries(LineSeries, options)
    const series = chart.addSeries(LineSeries, {
      color: "rgba(34,197,94,1)", // emerald-ish
      lineWidth: 2,
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // ✅ ResizeObserver keeps chart inside container
    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !chartRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      chartRef.current.applyOptions({ width: w, height: h });
      chartRef.current.timeScale().fitContent();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);

      try {
        const res = await fetch(`/api/history?symbol=${symbol}&range=${range}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "History fetch failed");

        const points: Point[] = (Array.isArray(data) ? data : []).map((p: any) => ({
          time: p.time,
          close: p.close,
        }));

        if (!points.length) throw new Error(`No history data for ${symbol}`);
        if (cancelled) return;

        const lineData: LineData<Time>[] = points.map((p) => ({
          time: p.time as Time,
          value: p.close,
        }));

        seriesRef.current?.setData(lineData);
        chartRef.current?.timeScale().fitContent();
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Failed to load chart");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return (
    <div className="h-full w-full">
      {/* Range Buttons */}
      <div className="mb-3 flex flex-wrap gap-2">
        {(["1D", "1W", "3M", "1Y", "5Y"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              "rounded-full px-3 py-1.5 text-xs font-bold border transition",
              r === range
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
                : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {r}
          </button>
        ))}

        {error && <div className="ml-auto text-xs text-red-400">{error}</div>}
      </div>

      {/* Chart Container */}
      <div ref={containerRef} className="h-[360px] w-full overflow-hidden rounded-xl" />
    </div>
  );
}
