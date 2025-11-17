import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    name: "FocusHub Unit Tests",
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "tests/**",
        "**/*.config.*",
        "**/*.d.ts",
        "**/types/**",
        "**/__tests__/**",
        "**/__mocks__/**",
      ],
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "services/**/*.{ts,tsx}",
        "stores/**/*.{ts,tsx}",
        "utils/**/*.{ts,tsx}",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "playwright-report/**",
      "test-results/**",
      "tests/e2e/**",
      "tests/performance/**",
      "tests/accessibility/**",
      "tests/visual/**",
      "tests/api/**",
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
      "@/components": resolve(__dirname, "./components"),
      "@/app": resolve(__dirname, "./app"),
      "@/hooks": resolve(__dirname, "./hooks"),
      "@/services": resolve(__dirname, "./services"),
      "@/stores": resolve(__dirname, "./stores"),
      "@/types": resolve(__dirname, "./types"),
      "@/utils": resolve(__dirname, "./utils"),
      "@/assets": resolve(__dirname, "./assets"),
      "@/config": resolve(__dirname, "./config"),
    },
  },
});
