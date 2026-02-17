import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";

// ✅ Must export a function named "middleware" (or default)
export const middleware = withAuth(
  function middleware(_req: NextRequest) {
    // withAuth handles the auth check + redirect; nothing needed here
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/", "/stock/:path*", "/compare/:path*"],
};
