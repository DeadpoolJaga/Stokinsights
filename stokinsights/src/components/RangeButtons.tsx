"use client";

export type Range = "1D" | "1W" | "3M" | "1Y" | "5Y";

export function RangeButtons({
  value,
  onChange,
}: {
  value: Range;
  onChange: (r: Range) => void;
}) {
  const ranges: Range[] = ["1D", "1W", "3M", "1Y", "5Y"];

  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={[
            "rounded-full px-3 py-1.5 text-xs font-bold border transition",
            r === value
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
              : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10",
          ].join(" ")}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
