import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Long-lived vendor chunks: they change far less often than app code
const vendorChunks: Record<string, string[]> = {
  react: ['react', 'react-dom', 'react-router', 'react-router-dom', 'scheduler'],
  motion: ['framer-motion', 'motion-dom', 'motion-utils'],
  data: ['@tanstack', 'axios', 'zod', 'react-hook-form', '@hookform'],
  realtime: ['socket.io-client', 'engine.io-client', 'socket.io-parser', 'engine.io-parser', '@socket.io'],
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          const pkg = id.split('node_modules/').pop()!.split('/').slice(0, id.includes('node_modules/@') ? 2 : 1).join('/')
          for (const [chunk, packages] of Object.entries(vendorChunks)) {
            if (packages.some((name) => pkg === name || pkg.startsWith(`${name}/`))) return chunk
          }
          return 'vendor'
        },
      },
    },
  },
})
