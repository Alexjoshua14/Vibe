import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: [
      "src/app/hooks/__tests__/useCurrentlyPlaying.test.ts",
      "src/lib/queue-session/__tests__/**/*.test.ts",
      "src/lib/queue-session/__tests__/**/*.test.tsx",
    ],
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
})
