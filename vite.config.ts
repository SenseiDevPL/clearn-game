import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // JSCPP's `printf` dependency does `instanceof require('stream').Stream`
    // internally; without this it crashes on every printf() call in the browser.
    nodePolyfills({ include: ['stream'] }),
  ],
})
