const API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (!API_KEY) {
  throw new Error("Missing ALPHAVANTAGE_API_KEY in environment");
}

const BASE = "https://www.alphavantage.co/query";

async function avFetch(params: Record<string, string>) {
  const url = new URL(BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("apikey", API_KEY!);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error(`AlphaVantage HTTP ${res.status}`);
  return res.json();
}

function assertOkAlphaVantage(json: any) {
  if (json?.Note) throw new Error(`RATE_LIMIT: ${json.Note}`);
  if (json?.Information) throw new Error(`INFO: ${json.Information}`);
  if (json?.["Error Message"]) throw new Error(`AV_ERROR: ${json["Error Message"]}`);
}

/* =========================
   QUOTE
========================= */

export type Quote = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
};

export async function fetchQuote(symbol: string): Promise<Quote> {
  const json = await avFetch({
    function: "GLOBAL_QUOTE",
    symbol,
  });

  assertOkAlphaVantage(json);

  const q = json["Global Quote"];
  if (!q) {
    const keys = Object.keys(json ?? {}).join(", ");
    throw new Error(`No quote data for ${symbol}. Keys: [${keys}]`);
  }

  return {
    symbol,
    price: Number(q["05. price"]),
    change: Number(q["09. change"]),
    changePercent: Number(String(q["10. change percent"]).replace("%", "")),
  };
}

/* =========================
   DAILY HISTORY (CLOSE + VOLUME)
========================= */

export type PricePoint = {
  time: number;
  close: number;
  volume: number;
};

export async function fetchDailyAdjusted(symbol: string): Promise<PricePoint[]> {
  const json = await avFetch({
    function: "TIME_SERIES_DAILY_ADJUSTED",
    symbol,
    outputsize: "full",
  });

  assertOkAlphaVantage(json);

  const series = json["Time Series (Daily)"];
  if (!series) {
    const keys = Object.keys(json ?? {}).join(", ");
    throw new Error(`No daily series for ${symbol}. Keys: [${keys}]`);
  }

  const points: PricePoint[] = Object.entries(series).map(([dateStr, v]: any) => {
    return {
      time: Math.floor(new Date(dateStr + "T00:00:00Z").getTime() / 1000),
      close: Number(v["4. close"]),
      volume: Number(v["6. volume"]),
    };
  });

  points.sort((a, b) => a.time - b.time);
  return points;
}
