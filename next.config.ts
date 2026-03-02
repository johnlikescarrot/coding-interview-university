import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Optimized for GitHub Pages deployment
  basePath: '/coding-interview-university',
  assetPrefix: '/coding-interview-university',
  trailingSlash: true,
  // Next.js 16: Enhanced build-time optimizations
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
