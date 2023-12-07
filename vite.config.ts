import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {imagetools} from "vite-imagetools";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue({}),
        // ViteImageOptimizer({
        //     /* pass your config */
        // }),
        imagetools(),
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
