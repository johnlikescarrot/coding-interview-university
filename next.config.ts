import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/coding-interview-university-app' : '',
  // Remove trailing slash to avoid double slashes in asset URLs
  assetPrefix: process.env.NODE_ENV === 'production' ? '/coding-interview-university-app' : '',
};

export default nextConfig;
