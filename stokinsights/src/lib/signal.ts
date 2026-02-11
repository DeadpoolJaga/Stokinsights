import { sma, rsi, pctChange } from "./indicators";

export type SignalResult = {
  direction: "UP" | "DOWN";
  probUp: number;            // 0..1
  confidence: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  features: Record<string, number | null>;
};

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export function computeSignal(closes: number[], volumes: number[]): SignalResult {
  const last = closes[closes.length - 1];
  const ma20 = sma(closes, 20);
  const ma50 = sma(closes, 50);
  const r = rsi(closes, 14);

  const ret1w = closes.length >= 6 ? pctChange(closes[closes.length - 6], last) : null;
  const ret1m = closes.length >= 21 ? pctChange(closes[closes.length - 21], last) : null;

  const vol20 = sma(volumes, 20);
  const volSpike = vol20 ? volumes[volumes.length - 1] / vol20 : null;

  // --- scoring ---
  let score = 0;
  const reasons: string[] = [];

  if (ma20 && last > ma20) { score += 1; reasons.push("Price above 20D average"); }
  if (ma50 && last > ma50) { score += 1; reasons.push("Price above 50D average"); }
  if (ma20 && ma50 && ma20 > ma50) { score += 1; reasons.push("20D trend above 50D trend"); }

  if (r !== null) {
    if (r >= 50 && r <= 70) { score += 1; reasons.push(`RSI healthy (${r.toFixed(0)})`); }
    else if (r > 75) { score -= 1; reasons.push(`RSI overbought (${r.toFixed(0)})`); }
    else if (r < 35) { score -= 1; reasons.push(`RSI weak (${r.toFixed(0)})`); }
  }

  if (ret1w !== null) {
    if (ret1w > 0) { score += 1; reasons.push(`1W momentum positive (${(ret1w*100).toFixed(1)}%)`); }
    else { score -= 1; reasons.push(`1W momentum negative (${(ret1w*100).toFixed(1)}%)`); }
  }

  if (volSpike !== null) {
    if (volSpike >= 1.2) { score += 1; reasons.push(`Volume elevated (${volSpike.toFixed(2)}x 20D avg)`); }
    else reasons.push(`Volume normal (${volSpike.toFixed(2)}x 20D avg)`);
  }

  const probUp = sigmoid(score);
  const direction = probUp >= 0.5 ? "UP" : "DOWN";

  const confidence =
    Math.abs(probUp - 0.5) >= 0.25 ? "HIGH" :
    Math.abs(probUp - 0.5) >= 0.12 ? "MEDIUM" : "LOW";

  return {
    direction,
    probUp,
    confidence,
    reasons: reasons.slice(0, 5),
    features: { last, ma20, ma50, rsi14: r, ret1w, ret1m, volSpike },
  };
}
