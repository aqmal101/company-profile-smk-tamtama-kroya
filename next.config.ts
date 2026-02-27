import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://localhost:3030"],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "storage.haruaki.my.id",
      }, 
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      }
    ],
  },
  
};

export default nextConfig;
