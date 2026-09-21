import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative, so a built copy can be dropped
// into any folder or static host without extra configuration.
// The iife output format (one plain script, no ES modules) is what lets
// build-single.mjs fold the whole app into a single HTML file that opens
// straight from the filesystem, with no server and no install.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5173, open: true },
  build: {
    // Keep CSS in its own file so the single-file build can put it in a
    // <style> tag, rather than having JavaScript inject it after load.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/app[extname]'
      }
    }
  }
})
