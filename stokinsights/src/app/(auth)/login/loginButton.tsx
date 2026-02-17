"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/15 to-sky-500/15 px-4 py-3 text-sm font-extrabold text-zinc-100 transition hover:from-emerald-500/25 hover:to-sky-500/25"
    >
      Continue with Google
    </button>
  );
}
