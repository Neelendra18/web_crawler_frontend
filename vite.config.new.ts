import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Use terser for JS, but use postcss for CSS minification
    minify: 'terser',
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        // You can add cssnano or other plugins here for advanced minification
      ],
    },
  },
});
