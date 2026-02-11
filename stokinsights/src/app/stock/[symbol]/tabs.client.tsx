"use client";

import { useState } from "react";

type Tab = "Study" | "Compare" | "Highlights";

export default function ClientTabs({ symbol }: { symbol: string }) {
  const [tab, setTab] = useState<Tab>("Study");

  const tabs: Tab[] = ["Study", "Compare", "Highlights"];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold border transition",
              tab === t
                ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
                : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        {tab === "Study" && (
          <div>
            <div className="font-extrabold">Study (prototype)</div>
            <div className="mt-1 text-sm text-zinc-400">
              Next step: sector, market cap, P/E, 52w high/low, analyst rating, etc.
            </div>
          </div>
        )}

        {tab === "Compare" && (
          <div>
            <div className="font-extrabold">Compare (prototype)</div>
            <div className="mt-1 text-sm text-zinc-400">
              Compare {symbol} against another stock by fundamentals and performance.
            </div>
          </div>
        )}

        {tab === "Highlights" && (
          <div>
            <div className="font-extrabold">Highlights (prototype)</div>
            <div className="mt-1 text-sm text-zinc-400">
              Next step: pull headlines + summarize into a single paragraph.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
