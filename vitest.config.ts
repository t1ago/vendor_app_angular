import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],

    coverage: {
      provider: 'v8',

      reporter: [
        'text', // resumo no terminal
        'text-summary',
        'html', // relatório navegável
      ],

      reportsDirectory: './coverage',

      include: ['src/**/*.ts'],
      exclude: ['**/*.spec.ts', '**/*.module.ts', '**/*.routes.ts', '**/main.ts'],
    },
  },
});
