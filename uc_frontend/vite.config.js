import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
     scss: {
       additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  server: {
    proxy: {
     '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
});