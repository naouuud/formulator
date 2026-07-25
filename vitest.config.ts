import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.spec.ts', 'projects/schema/**/*.spec.ts'],
    exclude: ['src/domain/store/domain-store.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
});
