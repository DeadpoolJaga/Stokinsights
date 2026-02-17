"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SYMBOLS } from "@/lib/symbols";


type Tab = "Study" | "Compare" | "Highlights";

export default function ClientTabs({ symbol }: { symbol: string }) {
  const [tab, setTab] = useState<Tab>("Study");
  const router = useRouter();
  const [compareSymbol, setCompareSymbol] = useState("MSFT");
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
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-extrabold text-zinc-200">
                Compare {symbol} with another stock
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
                {/* Select stock */}
                <select
                  value={compareSymbol}
                  onChange={(e) => setCompareSymbol(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-emerald-400/40"
                >
                  {SYMBOLS.filter((s) => s.symbol !== symbol).map((s) => (
                    <option key={s.symbol} value={s.symbol} className="bg-zinc-900">
                      {s.symbol} — {s.name}
                    </option>
                  ))}
                </select>

                {/* Navigate to Compare page */}
                <button
                  onClick={() =>
                    router.push(`/compare?left=${symbol}&right=${compareSymbol}&range=1Y`)
                  }
                  className="rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-extrabold text-emerald-200 hover:bg-emerald-500/25"
                >
                  Compare →
                </button>
              </div>

              <div className="mt-2 text-xs text-zinc-400">
                Opens side-by-side chart comparison with insights.
              </div>
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
