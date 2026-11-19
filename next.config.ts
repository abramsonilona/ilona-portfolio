import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable MP4 video in /public
  // Next.js serves /public as static assets — no extra config needed for mp4

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Strict mode
  reactStrictMode: true,

  // Temporary (307) redirect: the bare domain and www open the naming page.
  // Only applies on these hosts, so the *.vercel.app addresses keep the homepage.
  // To bring the homepage back on the domain, delete this block.
  async redirects() {
    return ["ilona-abramson.com", "www.ilona-abramson.com"].map((host) => ({
      source: "/",
      has: [{ type: "host" as const, value: host }],
      destination: "/naming",
      permanent: false,
    }));
  },
};

export default nextConfig;
