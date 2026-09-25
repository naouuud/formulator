import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@formulator/schema': path.join(rootDir, 'projects/schema/src/public-api.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: [
      'projects/schema/**/*.spec.ts',
      'projects/formulator-responder/src/**/*.spec.ts',
    ],
    exclude: [
      'projects/formulator-builder/**/domain-store.spec.ts',
      'projects/formulator-responder/**/app.spec.ts',
    ],
    setupFiles: ['projects/formulator-builder/src/test-setup.ts'],
  },
});
