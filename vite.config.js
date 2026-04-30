import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:80',
      '/webhook': 'http://localhost:80',
    },
    // allowedHosts: ['icons-estates-diabetes-chips.trycloudflare.com']
  },
})
