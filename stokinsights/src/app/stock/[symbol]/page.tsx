import StockChart from "@/components/StockChart";
import ClientQuote from "./quote.client";
import ClientTabs from "./tabs.client";
import SignalCard from "./signal.client";
import Link from "next/link";

export default async function StockPage(props: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await props.params;
  const sym = symbol.toUpperCase();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-3xl font-extrabold tracking-tight">{sym}</div>
          <div className="text-sm text-zinc-400">Chart ranges: 1D / 1W / 3M / 1Y / 5Y</div>
        </div>

        <Link
          href="/"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
        >
          ← Back
        </Link>
      </div>


      {/* AI Signal */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <SignalCard symbol={sym} />
      </div>

      {/* Quote */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-extrabold">Current Quote</div>
            <div className="text-xs text-zinc-400">Pulled from /api/quote</div>
          </div>
          <ClientQuote symbol={sym} />
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <StockChart symbol={sym} />
      </div>

      {/* Tabs */}
      <div className="pt-2">
        <ClientTabs symbol={sym} />
      </div>
    </div>
  );
}
