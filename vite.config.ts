// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Remova qualquer menção a 'tailwindcss' daqui.
// O Vite vai usar o arquivo postcss.config.js automaticamente.
export default defineConfig({
  plugins: [react()],
})