import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/idc-api': {
        target: 'http://10.180.40.94:9101/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/idc-api/, '')
      },
      '/pro-api': {
        target: 'http://auditxc.chinatowercom.cn:8068/base/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/pro-api/, '')
      },
    }
  }
})
