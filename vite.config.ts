import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     // https://rollupjs.org/configuration-options/
  //     output: {
  //
  //       sourcemap: 'inline'
  //     }
  //   },
  // },
  plugins: [
    vue({
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: process.env.NODE_ENV === 'production'
      ? '/nmd-arena/'
      : '/'
})
