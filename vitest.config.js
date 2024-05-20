/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    setupFiles: ['./setupTest.ts'],
    include: ['./src/tests/*.spec.ts']
  },
})