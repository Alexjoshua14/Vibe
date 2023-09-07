import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ['src/__tests__/**/*.test.ts', 'src/__tests__/**/*.test.tsx', 'src/**/__tests__/*.test.ts'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})