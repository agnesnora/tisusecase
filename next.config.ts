// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Itt adhatsz hozzá konfigurációkat ha szükséges
// };

// export default nextConfig;
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const config: NextConfig = {};

export default withNextIntl(config);
