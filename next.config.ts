import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// i18n request config lives in i18n/request.ts
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Remote image sources: Object Storage (S3-compatible) + future CDN.
  // Update/extend once the real bucket & CDN domains are provisioned.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.s3.**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_CDN_HOSTNAME || "cdn.example.com",
      },
    ],
  },

  experimental: {
    // Server Actions are enabled by default in Next.js 15; kept explicit for clarity.
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default withNextIntl(nextConfig);
