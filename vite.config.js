import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const appDir = fileURLToPath(new URL('.', import.meta.url))
const workspaceRoot = resolve(appDir, '..', '..')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wiki': resolve(appDir, 'src'),
      // Polyfill for gray-matter in browser
      'buffer': 'buffer/'
    }
  },
  define: {
    'global': 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  server: {
    fs: {
      allow: [workspaceRoot]
    }
  }
})
