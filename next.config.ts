import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow next/image to load our placeholder photos from Unsplash.
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
