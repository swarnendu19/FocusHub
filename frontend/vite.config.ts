import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { VitePWA } from 'vite-plugin-pwa'
/// <reference types="vitest" />

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react({
        // Optimize JSX in production
        jsxRuntime: 'automatic',
      }),
      tailwindcss(),
      // PWA plugin for offline functionality
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\./,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Gamified Time Tracker',
          short_name: 'TimeTracker',
          description: 'A gamified time tracking application with XP, achievements, and leaderboards',
          theme_color: '#3b82f6',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      // Bundle analyzer for production builds
      mode === 'analyze' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@/components': resolve('./src/components'),
        '@/pages': resolve('./src/pages'),
        '@/hooks': resolve('./src/hooks'),
        '@/services': resolve('./src/services'),
        '@/stores': resolve('./src/stores'),
        '@/types': resolve('./src/types'),
        '@/utils': resolve('./src/utils'),
        '@/assets': resolve('./src/assets'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode === 'production' ? false : true, // Disable sourcemaps in production for security
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'], // Modern browser targets
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console logs in production
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
        mangle: {
          safari10: true,
        },
        format: {
          comments: false, // Remove comments
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // More intelligent chunking strategy
            if (id.includes('node_modules')) {
              // Core React libraries
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              // Router and state management
              if (id.includes('react-router') || id.includes('zustand')) {
                return 'vendor-routing';
              }
              // UI and animation libraries
              if (id.includes('framer-motion') || id.includes('@radix-ui')) {
                return 'vendor-ui';
              }
              // Utility libraries
              if (id.includes('axios') || id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'vendor-utils';
              }
              // Chart and visualization libraries
              if (id.includes('recharts') || id.includes('d3')) {
                return 'vendor-charts';
              }
              // Other node_modules
              return 'vendor-misc';
            }
            // App code chunking
            if (id.includes('/pages/')) {
              return 'pages';
            }
            if (id.includes('/components/')) {
              return 'components';
            }
            if (id.includes('/stores/') || id.includes('/services/')) {
              return 'services';
            }
          },
          // Optimize chunk file names with better caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext || '')) {
              return `css/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext || '')) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
        // External dependencies that should not be bundled
        external: mode === 'production' ? [] : [],
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000, // 1MB warning limit
      // Enable compression reporting
      reportCompressedSize: true,
      // Optimize dependencies
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      // CSS code splitting
      cssCodeSplit: true,
      // Asset inlining threshold
      assetsInlineLimit: 4096, // 4KB
    },
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __PROD__: mode === 'production',
    },
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'zustand',
        'axios',
        'framer-motion',
        'clsx',
        'tailwind-merge',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
      css: true,
    },
  }
})
