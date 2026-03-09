// Learn more about Vitest configuration options at https://vitest.dev/config/

import path from 'path';
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, './src/app/shared')
    }
  },
  plugins: [angular({
    jit: true, // Força o modo JIT para resolver templates externos
    tsconfig: './tsconfig.spec.json' // Garante que ele use as regras de teste
  })],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['**/*.spec.ts'],
  },
});


// import path from 'path';
// import { defineConfig } from 'vitest/config';

// export default defineConfig({
//   resolve: {
//     alias: {
//       '@shared': path.resolve(__dirname, './src/app/shared')
//     }
//   },
//   test: {
//     globals: true,
//     css: false,
//     environment: 'jsdom',
//     setupFiles: ['./vitest.setup.ts'],
//     coverage: {
//       provider: 'v8',
//       reporter: [
//         'text',
//         'json',
//         'html',
//       ],
//       thresholds: {
//         statements: 80,
//         branches: 80,
//         functions: 80,
//         lines: 80,
//       },
//       reportsDirectory: './coverage',
//       include: ['src/**/*.ts'],
//       exclude: ['**/*.spec.ts', '**/*.module.ts', '**/*.routes.ts', '**/main.ts'],
//     }
//   },
// });
