"use client";

import { useMemo, useState } from "react";

export default function Logo({
  srcs,
  alt,
  fallbackText,
}: {
  srcs: string[];
  alt: string;
  fallbackText: string;
}) {
  const candidates = useMemo(() => srcs.filter(Boolean), [srcs]);
  const [idx, setIdx] = useState(0);

  const src = candidates[idx];

  if (!src) {
    return (
      <div className="h-10 w-10 rounded-xl bg-zinc-900 ring-1 ring-white/10 grid place-items-center">
        <span className="text-xs font-black text-zinc-300">{fallbackText}</span>
      </div>
    );
  }

  return (
    <div className="h-10 w-10 rounded-xl bg-zinc-900 ring-1 ring-white/10 grid place-items-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-7 w-7 object-contain"
        onError={() => setIdx((prev) => prev + 1)}
      />
    </div>
  );
}
