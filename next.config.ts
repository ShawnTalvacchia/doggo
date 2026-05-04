import type { NextConfig } from "next";
import { tmpdir } from "node:os";
import path from "node:path";

const nextConfig: NextConfig = {
  /**
   * Desktop/iCloud sync can corrupt on-disk bundler caches (.pack.gz / Turbopack .sst DB).
   * - Default `npm run dev` uses webpack with cache under `$TMPDIR/doggo-next-webpack-cache`.
   * - `npm run dev:turbo` uses Turbopack with dev filesystem cache disabled (memory-only task graph).
   */
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: "filesystem",
        cacheDirectory: path.join(tmpdir(), "doggo-next-webpack-cache"),
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
