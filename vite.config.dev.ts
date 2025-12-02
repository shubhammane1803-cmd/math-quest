import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { miaodaDevPlugin } from 'miaoda-sc-plugin';

export default defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
      exportType: 'named',
      namedExport: 'ReactComponent',
    },
  }), miaodaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/components'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
    open: false,
  },
});