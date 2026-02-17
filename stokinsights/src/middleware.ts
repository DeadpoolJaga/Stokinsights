export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/stock/:path*", "/compare/:path*"],
};
