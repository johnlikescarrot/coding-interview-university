import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Ensure base path is correct for GitHub Pages if needed
  // basePath: '/repository-name',
};

export default nextConfig;
