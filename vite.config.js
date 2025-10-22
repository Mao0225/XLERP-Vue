import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: '/erp/',//路由前缀
  build: {
    target: ['es2022', 'edge89', 'firefox90', 'chrome90', 'safari15']
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
