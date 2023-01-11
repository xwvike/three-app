import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  transpileDependencies: true,
  base:'./',
  server: {
    open: true,
    port: 3005,
    host: '0.0.0.0'
  },
  plugins: [vue()],
})
