import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

/**
 * Vitest config. Node environment (all units under test are pure/server logic),
 * with the same `@/` alias as tsconfig so tests import modules exactly as the app does.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
    css: false,
  },
  // Units under test are pure logic — skip the app's Tailwind PostCSS pipeline.
  css: { postcss: { plugins: [] } },
  resolve: {
    alias: { "@": resolve(__dirname, ".") },
  },
});
