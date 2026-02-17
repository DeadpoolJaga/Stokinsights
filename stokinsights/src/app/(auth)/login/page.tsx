import LoginButton from "./loginButton";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] h-[520px] w-[520px] rounded-full bg-sky-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_40%)]" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />

      {/* Ticker tape */}
      <div className="absolute top-6 left-1/2 w-[1100px] -translate-x-1/2 overflow-hidden rounded-full border border-white/10 bg-white/5">
        <div className="whitespace-nowrap py-2 text-xs text-zinc-300 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <span className="inline-block animate-[marquee_22s_linear_infinite]">
            AAPL +1.24% &nbsp;&nbsp; MSFT +0.62% &nbsp;&nbsp; NVDA +2.05% &nbsp;&nbsp; TSLA -0.71% &nbsp;&nbsp; AMZN +0.48% &nbsp;&nbsp; META +1.01% &nbsp;&nbsp; SPY +0.33% &nbsp;&nbsp;
          </span>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2">
        {/* Left: pitch + illustration */}
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            StokInsights • Research-first investing UI
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Trade like a PRO <span className="text-emerald-300">Research</span>-first intelligence.
          </h1>

          <p className="text-zinc-300">
            Compare stocks, explore fundamentals, and view AI-style signals.
          </p>

          {/* Mini chart card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">Market Pulse</div>
                <div className="text-xs text-zinc-400">Synthetic preview — live data after login</div>
              </div>
              <div className="text-xs font-bold text-emerald-300">UPTREND</div>
            </div>

            <svg viewBox="0 0 480 140" className="mt-3 h-28 w-full">
              <path
                d="M10 110 L70 95 L120 100 L180 70 L230 80 L290 55 L340 60 L400 30 L470 35"
                fill="none"
                stroke="rgba(34,197,94,0.95)"
                strokeWidth="3.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              <path
                d="M10 130 L70 115 L120 120 L180 90 L230 100 L290 75 L340 80 L400 50 L470 55"
                fill="none"
                stroke="rgba(56,189,248,0.65)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>

            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-zinc-400">
              <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                <div className="text-zinc-300 font-bold">1Y</div>
                <div>Volatility</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                <div className="text-zinc-300 font-bold">Compare</div>
                <div>Overlay</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/30 p-2">
                <div className="text-zinc-300 font-bold">Signals</div>
                <div>Confidence</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: login card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
            <div className="mb-1 text-2xl font-extrabold">Sign in</div>
            <div className="text-sm text-zinc-400">
              Access your watchlist, compare workspace, and subscription features.
            </div>

            <div className="mt-6 space-y-3">
              <LoginButton />
              <div className="text-xs text-zinc-500">
                By continuing, you agree this is an educational prototype (not financial advice).
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
              <div className="text-sm font-bold">Subscription-ready</div>
              <div className="mt-1 text-xs text-zinc-400">
                After login, your account can be checked for an active subscription (Stripe) to unlock Study/Highlights.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind marquee keyframes */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
