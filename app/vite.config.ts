import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const BUILD_ID = new Date().toISOString().slice(0, 16).replace('T', ' ');

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  plugins: [react()],
  build: {
    // Emit legacy `@media (max-width: …)` instead of CSS Media Queries Level 4
    // range syntax `@media (width <= …)`. The minifier's default modern target
    // produces the range form, which iOS Safari ignores before 16.4 — that
    // silently disabled every responsive breakpoint on older iPhones and left
    // desktop layouts overflowing the screen. safari14 forces the compatible form.
    cssTarget: 'safari14',
  },
})
