import { Suspense } from "react";
import CompareClient from "./CompareClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-sm text-zinc-400">Loading compare…</div>}>
      <CompareClient />
    </Suspense>
  );
}
