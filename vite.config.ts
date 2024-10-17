import { defineConfig } from 'vite'
import ts from 'vite-plugin-ts'

export default defineConfig({
  plugins: [ts()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist/client',
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
