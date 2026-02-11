import Link from "next/link";
import { SYMBOLS } from "@/lib/symbols";
import Logo from "@/components/Logo";
import { logoCandidates } from "@/lib/logos";

export default function HomePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Watchlist</h1>
        <p className="text-sm text-zinc-400">
          Tap a stock to view chart, AI signal, and research tabs.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {SYMBOLS.map((s) => {
          const logos = logoCandidates(s.symbol);
          return (
            <Link
              key={s.symbol}
              href={`/stock/${s.symbol}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const logos = logoCandidates(s.symbol);
                    return (
                      <Logo
                        srcs={logos}
                        alt={`${s.name} logo`}
                        fallbackText={s.symbol.slice(0, 2)}
                      />
                    );
                  })()}

                  <div>
                    <div className="font-extrabold tracking-tight">{s.symbol}</div>
                    <div className="text-xs text-zinc-400 line-clamp-1">{s.name}</div>
                  </div>
                </div>

                <div className="text-zinc-400 group-hover:text-zinc-200 transition">→</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-zinc-500">Open</div>
                <div className="text-xs text-emerald-300/90">Insights</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
