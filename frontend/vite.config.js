import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // Asegura que Vite use exactamente el puerto especificado
    // Otras configuraciones de servidor de desarrollo si es necesario
  }
})
