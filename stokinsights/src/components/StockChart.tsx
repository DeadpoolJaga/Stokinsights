"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, type IChartApi, type ISeriesApi, LineSeries, type LineData } from "lightweight-charts";
import { RangeButtons, type Range } from "./RangeButtons";

type Point = { time: number; value: number };

export default function StockChart({ symbol }: { symbol: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Line"> | null>(null);

  const [range, setRange] = useState<Range>("1Y");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const height = 320;

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height,
      layout: {
        background: { color: "#0b0f14" }, // dark background
        textColor: "#d1d4dc",             // TradingView-like text
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: "#9ca3af",
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        vertLine: {
          color: "#6b7280",
          width: 1,
          style: 1,
        },
        horzLine: {
          color: "#6b7280",
          width: 1,
          style: 1,
        },
      },
    });


    chartRef.current = chart;

    // ✅ v5+ API: addSeries(LineSeries, options)
    const series = chart.addSeries(LineSeries, {
      color: "#22c55e",      // green line
      lineWidth: 2,
    });

    seriesRef.current = series;

    const handleResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!seriesRef.current) return;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/history?symbol=${symbol}&range=${range}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load history");

        type Point = { time: number; close: number; volume: number };

        const data: LineData[] = (json as Point[]).map((p) => ({
          time: p.time as any,
          value: p.close,
        }));




        if (!cancelled) {
          seriesRef.current!.setData(data);
          chartRef.current?.timeScale().fitContent();
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || "Error loading chart");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <RangeButtons value={range} onChange={setRange} />
        <div style={{ fontSize: 12, color: "#666" }}>
          {loading ? "Loading..." : error ? error : ""}
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          width: "100%",
          border: "1px solid #1f2937",
          borderRadius: 16,
          padding: 6,
          background: "#0b0f14",
        }}
      />
    </div>
  );
}
