"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  IChartApi,
  ISeriesApi,
  LineData,
  LineSeries,
  Time,
} from "lightweight-charts";
import type { HistoryPoint } from "@/lib/metrics";

export default function CompareChart({
  leftSymbol,
  rightSymbol,
  left,
  right,
}: {
  leftSymbol: string;
  rightSymbol: string;
  left: HistoryPoint[];
  right: HistoryPoint[];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const leftSeriesRef = useRef<ISeriesApi<typeof LineSeries> | null>(null);
  const rightSeriesRef = useRef<ISeriesApi<typeof LineSeries> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const el = containerRef.current;

    const chart = createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight || 380,
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

    const leftSeries = chart.addSeries(LineSeries, {
      color: "rgba(34,197,94,1)",
      lineWidth: 2,
    });

    const rightSeries = chart.addSeries(LineSeries, {
      color: "rgba(56,189,248,1)", // cyan-ish
      lineWidth: 2,
    });

    chartRef.current = chart;
    leftSeriesRef.current = leftSeries;
    rightSeriesRef.current = rightSeries;

    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !chartRef.current) return;
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
      chartRef.current.timeScale().fitContent();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      leftSeriesRef.current = null;
      rightSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    const toLine = (pts: HistoryPoint[]): LineData<Time>[] =>
      pts.map((p) => ({ time: p.time as Time, value: p.close }));

    leftSeriesRef.current?.setData(toLine(left));
    rightSeriesRef.current?.setData(toLine(right));
    chartRef.current?.timeScale().fitContent();
  }, [left, right]);

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-bold text-zinc-200">{leftSymbol}</span>
        </span>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="font-bold text-zinc-200">{rightSymbol}</span>
        </span>
      </div>

      <div ref={containerRef} className="h-[380px] w-full overflow-hidden rounded-xl" />
    </div>
  );
}
