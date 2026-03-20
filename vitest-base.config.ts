// Learn more about Vitest configuration options at https://vitest.dev/config/

import path from 'path';
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
    resolve: {
        alias: {
            '@shared': path.resolve(__dirname, './src/app/shared'),
        },
    },
    plugins: [
        angular({
            jit: true,
            tsconfig: './tsconfig.spec.json',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.spec.ts'],
        coverage: {
            enabled: false,
            provider: 'v8',
            clean: true,
            reporter: ['text', 'json', 'html', 'lcov'],
            reportsDirectory: './coverage',
            include: ['src/**/*.ts'],
            exclude: [
                'src/**/*.spec.ts',
                'src/**/*.config.ts',
                'src/main.ts',
                'src/main.server.ts',
                'src/server.ts',
                'src/environments/**',
                '**/*.d.ts',
                '**/node_modules/**',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
