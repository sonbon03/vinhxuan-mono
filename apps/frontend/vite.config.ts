import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 3000,
    fs: {
      // Allow serving files from the monorepo root
      allow: ['../../'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8830',
        changeOrigin: true,
      },
    },
  },
});
