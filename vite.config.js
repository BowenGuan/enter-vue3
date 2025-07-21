import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/audit-idc': {
        target: 'http://10.180.40.94:9101',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/audit-idc/, '')
      },
      '/audit-pro': {
        target: 'http://auditxc.chinatowercom.cn:8068/base',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/audit-pro/, '')
      },
      '/smart-idc': {
        target: ' http://10.180.40.91:18068/bigscreen',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/smart-idc/, '')
      },
      '/smart-pro': {
        target: 'https://auditsmart.chinatowercom.cn:8078/bigscreen',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/smart-pro/, '')
      }
    }
  }
})
