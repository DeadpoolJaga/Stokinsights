import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-zinc-950/70 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/25 grid place-items-center">
                  <span className="text-emerald-300 font-black">S</span>
                </div>
                <div>
                  <div className="font-extrabold leading-5">StokInsights</div>
                  <div className="text-xs text-zinc-400">charts • signals • highlights</div>
                </div>
              </Link>

              <nav className="flex items-center gap-2">
                <Link
                  href="/compare"
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
                >
                  Compare
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

          <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 text-xs text-zinc-500">
            Educational project. Not investment advice.
          </footer>
        </div>
      </body>
    </html>
  );
}
