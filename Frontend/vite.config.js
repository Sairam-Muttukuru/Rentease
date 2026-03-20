/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:process.env.VITE_BASE_PATH || '/Rentease/tree/main/Frontend',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-ui': ['framer-motion', 'react-toastify', 'sweetalert2'],
          'vendor-utils': ['axios', 'i18next', 'react-i18next']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
