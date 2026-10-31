import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  root: 'app',
  publicDir: '../public',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      '/backend': {
        target: 'http://localhost:5000',
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
  clearScreen: false,
  plugins: [react()],
})
