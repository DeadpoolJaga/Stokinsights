export type HistoryPoint = { time: number; close: number };

function dailyReturns(points: HistoryPoint[]) {
  const r: number[] = [];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].close;
    const cur = points[i].close;
    if (prev > 0) r.push(cur / prev - 1);
  }
  return r;
}

export function computeReturnPct(points: HistoryPoint[]) {
  if (points.length < 2) return 0;
  const first = points[0].close;
  const last = points[points.length - 1].close;
  return first > 0 ? ((last / first) - 1) * 100 : 0;
}

export function computeVolatilityPct(points: HistoryPoint[]) {
  const r = dailyReturns(points);
  if (r.length < 2) return 0;

  const mean = r.reduce((a, b) => a + b, 0) / r.length;
  const variance = r.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (r.length - 1);
  const stdev = Math.sqrt(variance);

  // daily stdev -> percentage
  return stdev * 100;
}

export function computeMaxDrawdownPct(points: HistoryPoint[]) {
  if (points.length < 2) return 0;

  let peak = points[0].close;
  let maxDd = 0;

  for (const p of points) {
    if (p.close > peak) peak = p.close;
    const dd = peak > 0 ? (p.close / peak - 1) * 100 : 0; // negative number
    if (dd < maxDd) maxDd = dd;
  }
  return maxDd; // negative %
}

export function computeCorrelation(a: HistoryPoint[], b: HistoryPoint[]) {
  // align by index (good enough for v1 since we fetch same range)
  const n = Math.min(a.length, b.length);
  if (n < 5) return 0;

  const ra = dailyReturns(a.slice(0, n));
  const rb = dailyReturns(b.slice(0, n));
  const m = Math.min(ra.length, rb.length);
  if (m < 5) return 0;

  const xa = ra.slice(0, m);
  const xb = rb.slice(0, m);

  const meanA = xa.reduce((s, v) => s + v, 0) / m;
  const meanB = xb.reduce((s, v) => s + v, 0) / m;

  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < m; i++) {
    const da = xa[i] - meanA;
    const db = xb[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }

  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}
