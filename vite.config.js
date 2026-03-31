import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
    // Eliminamos el proxy porque ya definimos la URL completa en api.js
  }
})