import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "hu"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/", "/(hu|en)/:path*"],
};
