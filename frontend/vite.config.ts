import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      //proxy to pbs api directly
      '/api/v1': {
        target: 'https://media.services.pbs.org',
        changeOrigin: true
      },
      //proxy to php backend
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  plugins: [react()]
});