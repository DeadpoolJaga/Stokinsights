import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { fetchQuote, Quote } from "@/lib/alphaVantage";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "").toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  }

  const key = `quote:${symbol}`;
  const cached = cacheGet<Quote>(key);
  if (cached) return NextResponse.json(cached);

  try {
    const quote = await fetchQuote(symbol);
    cacheSet(key, quote, 60_000); // 1 minute
    return NextResponse.json(quote);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Quote fetch failed" }, { status: 500 });
  }
}
