import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "@/lib/cache";
import { fetchStooqDaily } from "@/lib/stooqHistory";
import { computeSignal } from "@/lib/signal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const symbol = (searchParams.get("symbol") || "").toUpperCase();

  if (!symbol) return NextResponse.json({ error: "Missing symbol" }, { status: 400 });

  const key = `predict:${symbol}`;
  const cached = cacheGet<any>(key);
  if (cached) return NextResponse.json(cached);

  try {
    const points = await fetchStooqDaily(symbol);

    // use last ~260 trading days to compute indicators safely
    const recent = points.slice(Math.max(0, points.length - 260));
    const closes = recent.map((p) => p.close);
    const volumes = recent.map((p) => p.volume);


    const result = computeSignal(closes, volumes);

    const payload = {
      symbol,
      ...result,
      updatedAt: new Date().toISOString(),
    };

    cacheSet(key, payload, 30 * 60_000); // 30 mins
    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Predict failed" }, { status: 500 });
  }
}
