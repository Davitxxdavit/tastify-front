import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      restoreMocks: true,
      // Deterministic API origin regardless of local .env files
      env: { VITE_API_ORIGIN: 'http://localhost:3000' },
    },
  }),
)
