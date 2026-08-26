import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: 'mpa',
  // Mantiene el JSON enlazado simbólicamente dentro de la raíz del proyecto.
  resolve: { preserveSymlinks: true, alias: { '@': resolve(__dirname, 'src') } },
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        tabla: resolve(__dirname, 'tabla.html'),
        metricas: resolve(__dirname, 'metricas.html'),
      },
    },
  },
  server: { fs: { allow: ['..', '../..'] } },
});
