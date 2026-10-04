import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosts next/image may load photos from: Unsplash (placeholders and older
  // listings) and our Vercel Blob store (uploads).
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Photos hosts upload through Vercel Blob.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
