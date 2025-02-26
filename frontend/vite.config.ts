import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    proxy: {
      '/api/v1': {
        target: 'https://media.services.pbs.org',
        changeOrigin: true
      }
    }
  },
  plugins: [react()]
});