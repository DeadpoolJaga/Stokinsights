import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { fetchStooqDaily, StooqPoint } from "@/lib/stooqHistory";

type Range = "1D" | "1W" | "3M" | "1Y" | "5Y";

function cutoffUnix(range: Range): number {
  const now = new Date();
  const d = new Date(now);

  // Prototype: "1D" -> last 5 trading days from daily data (good enough)
  switch (range) {
    case "1D":
      d.setDate(d.getDate() - 7);
      break;
    case "1W":
      d.setDate(d.getDate() - 9);
      break;
    case "3M":
      d.setMonth(d.getMonth() - 3);
      break;
    case "1Y":
      d.setFullYear(d.getFullYear() - 1);
      break;
    case "5Y":
      d.setFullYear(d.getFullYear() - 5);
      break;
  }

  return Math.floor(d.getTime() / 1000);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "").toUpperCase();
  const range = (searchParams.get("range") || "1Y").toUpperCase() as Range;

  const allowed: Range[] = ["1D", "1W", "3M", "1Y", "5Y"];
  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  if (!allowed.includes(range)) return NextResponse.json({ error: "Invalid range" }, { status: 400 });

  const key = `history:${symbol}:${range}`;
  const cached = cacheGet<StooqPoint[]>(key);

  if (cached) return NextResponse.json(cached);

  try {
    const all = await fetchStooqDaily(symbol); // ✅ Stooq now
    const cut = cutoffUnix(range);

    let filtered = all.filter((p) => p.time >= cut);

    if (range === "1D" || range === "1W") {
      filtered = filtered.slice(Math.max(0, filtered.length - 30));
    }

    cacheSet(key, filtered, 24 * 60 * 60 * 1000); // 24 hours
    return NextResponse.json(filtered);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "History fetch failed" }, { status: 500 });
  }
}
