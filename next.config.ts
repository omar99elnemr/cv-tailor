import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist", "mammoth"],
  turbopack: {
    resolveAlias: {
      canvas: { browser: "./empty-module.js" },
    },
  },
  webpack: (config) => {
    // pdfjs-dist optionally depends on canvas (not available in serverless)
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
