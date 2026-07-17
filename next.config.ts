import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === "true";
const siteUrl = isStaticExport ? "https://monster7337.github.io" : "https://в-елках.рф";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  experimental: {
    inlineCss: true,
  },
  allowedDevOrigins: ["192.168.0.5"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    qualities: [75],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
      }
    : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
