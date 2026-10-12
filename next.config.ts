import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare and tunnel origins during local dev without cross-origin HMR warnings
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "allows-excel-lincoln-kings.trycloudflare.com",
    "localhost:3000",
  ],
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
