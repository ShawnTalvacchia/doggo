import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turboPersistentCaching: false,
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
