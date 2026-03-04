import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "*.primeconnects.ae" },
      { protocol: "https", hostname: "primeconnects.ae" },
    ],
  },
};

export default nextConfig;
