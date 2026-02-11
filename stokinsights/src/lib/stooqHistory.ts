import { toStooqSymbol } from "./stooq";

export type StooqPoint = {
  time: number;   // unix seconds
  close: number;
  volume: number;
};

export async function fetchStooqDaily(symbol: string): Promise<StooqPoint[]> {
  const stooqSym = toStooqSymbol(symbol);
  const url = `https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSym)}&i=d`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Stooq HTTP ${res.status}`);

  const csv = await res.text();

  // Basic CSV parsing (no external libs)
  const lines = csv.trim().split("\n");
  if (lines.length < 2) throw new Error(`No Stooq data for ${symbol}`);

  // Header: Date,Open,High,Low,Close,Volume
  const out: StooqPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(",");
    if (row.length < 6) continue;

    const dateStr = row[0];
    const closeStr = row[4];
    const volStr = row[5];

    if (!dateStr || closeStr === "" || volStr === "") continue;

    const close = Number(closeStr);
    const volume = Number(volStr);

    // Stooq sometimes returns empty or NaN rows
    if (!Number.isFinite(close) || !Number.isFinite(volume)) continue;

    const time = Math.floor(new Date(dateStr + "T00:00:00Z").getTime() / 1000);
    out.push({ time, close, volume });
  }

  // Ensure ascending
  out.sort((a, b) => a.time - b.time);
  if (out.length === 0) throw new Error(`No usable Stooq rows for ${symbol}`);

  return out;
}
