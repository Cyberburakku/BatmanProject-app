import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative, so a built copy can be dropped
// into any folder or static host without extra configuration.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, open: true }
})
