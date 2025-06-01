import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server: {
    proxy: {
      '/plus': {
        target: `http://192.168.62.14:9016`,
        changeOrigin: true,
        secure: false,
        headers: {
          origin: 'http://172.18.14.130:7116',
          referer: 'http://172.18.14.130:7116'
        }
      }
    },
    host: '0.0.0.0'
  }
})
