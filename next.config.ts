import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    // Allow Cloudflare tunnel origin in dev to load /_next assets
    allowedDevOrigins: [
      "https://baptist-peoples-sail-custom.trycloudflare.com",
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
    };
    return config;
  },
};

export default nextConfig;
