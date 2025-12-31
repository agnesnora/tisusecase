import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "hu"],
  defaultLocale: "en",
  // localePrefix: "never",
  // localeDetection: false,
});

export const config = {
  // matcher: ["/", "/(hu|en)/:path*"],
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
