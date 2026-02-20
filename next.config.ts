import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "mammoth"],
  turbopack: {},
  webpack: (config) => {
    // pdf-parse optionally depends on canvas (not available in serverless)
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
