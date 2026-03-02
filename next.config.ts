import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/coding-interview-university',
  assetPrefix: '/coding-interview-university',
  reactStrictMode: true,
};

export default nextConfig;
