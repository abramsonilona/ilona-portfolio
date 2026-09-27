import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/projects/shapira-beer",
        destination: "/projects/bira-shapira",
        permanent: true,
      },
    ];
  },
  // Enable MP4 video in /public
  // Next.js serves /public as static assets — no extra config needed for mp4

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Strict mode
  reactStrictMode: true,
};

export default nextConfig;
