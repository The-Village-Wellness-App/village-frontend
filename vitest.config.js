import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
  },
});
