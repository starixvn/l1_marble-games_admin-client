/// <reference types="vitest" />
/// <reference types="vitest/globals" />
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    watch: false,
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ["clover", "lcov", "text-summary", "cobertura"],
      reportsDirectory: './coverage',
      exclude: ['node_modules', 'dist', 'build', 'public', 'public/**', 'src/components/ui/**', 'src/setupTests.ts'],
    },
    typecheck: {
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
    reporters: ['junit', 'default'],
    outputFile: {
      junit: './test-report.xml'
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
  },
})
