import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.{test,spec}.{js,jsx}'],
    setupFiles: [path.join(rootDir, 'tests/setup.js')],
  },
  resolve: {
    alias: {
      '@server': path.join(rootDir, 'packages/server'),
      '@client': path.join(rootDir, 'packages/client/src'),
    },
  },
});
