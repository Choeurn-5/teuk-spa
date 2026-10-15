import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare and tunnel origins during local dev without cross-origin HMR warnings
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "allows-excel-lincoln-kings.trycloudflare.com",
    "localhost:3000",
  ],
  serverExternalPackages: ["firebase-admin", "sharp"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
    ],
  },
};

export default nextConfig;
