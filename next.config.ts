import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as NextConfig;

// Only resolve the loader path if we are in development and NOT on Vercel
if (process.env.NODE_ENV === 'development' && !process.env.CI) {
  try {
    const loaderPath = require.resolve('orchids-visual-edits/loader.js');
    (nextConfig as any).turbopack = {
      rules: {
        "*.{jsx,tsx}": {
          loaders: [loaderPath]
        }
      }
    };
  } catch (e) {
    // Ignore if not found
  }
}

export default nextConfig;
