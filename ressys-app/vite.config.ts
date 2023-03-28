/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc';
import envars from 'envars';
import { defineConfig } from 'vite';

envars.config();

const keys = Object.keys(process.env);
['GRAPHQL_URL', 'APP_ORIGIN', 'PORT'].forEach((key) => {
  if (keys.includes(key)) {
    process.env[`VITE_${key}`] = process.env[key];
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  cacheDir: '../.cache/ressys-app',
  plugins: [react({ jsxImportSource: '@emotion/react' })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  preview: {
    port: process.env.VITE_PORT ? Number.parseInt(process.env.VITE_PORT) : 4000,
  },
});
