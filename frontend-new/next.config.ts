import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Performance optimizations */
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-progress',
      '@radix-ui/react-slot',
      '@radix-ui/react-toast',
      '@radix-ui/react-toggle-group',
      'lucide-react',
    ],
  },

  /* Compiler optimizations */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  /* Image optimization */
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /* Environment variables */
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  /* Bundle analyzer */
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      config.plugins.push(
        new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
      return config;
    },
  }),

  /* TypeScript configuration */
  typescript: {
    ignoreBuildErrors: false,
  },

  /* Output configuration */
  output: 'standalone',

  /* Headers for security */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
