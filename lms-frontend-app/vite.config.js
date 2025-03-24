import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Optional: Global test setup file
    coverage: {
      reporter: ['text', 'json', 'html'], // Enables test coverage reports
    },
  },
});

//npx vitest run --coverage


