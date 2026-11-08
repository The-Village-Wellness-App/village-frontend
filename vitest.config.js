
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-transition-group/TransitionGroupContext': path.resolve(
        __dirname,
        'node_modules/react-transition-group/cjs/TransitionGroupContext.js',
      ),
      '@mui/material/node_modules/react-transition-group': path.resolve(
        __dirname,
        'node_modules/react-transition-group',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    clearMocks: true,
    restoreMocks: true,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
