import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configura o Vite para rodar na porta 5173 padrão
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
