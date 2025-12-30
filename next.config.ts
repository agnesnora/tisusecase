import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ide jöhetnek az egyéb beállításaid, ha vannak
};

export default withNextIntl(nextConfig);
