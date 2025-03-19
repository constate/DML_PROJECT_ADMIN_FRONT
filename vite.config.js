import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 9311,
    },
    plugins: [react()],
    resolve: {
        alias: [
            { find: '@', replacement: '/src' },
            { find: '@assets', replacement: '/src/assets' },
            { find: '@components', replacement: '/src/components' },
            { find: '@hooks', replacement: '/src/hooks' },
            { find: '@pages', replacement: '/src/pages' },
            { find: '@router', replacement: '/src/router' },
            { find: '@styles', replacement: '/src/styles' },
            { find: '@utils', replacement: '/src/utils' },
            { find: '@apis', replacement: '/src/apis' },
            { find: '@stores', replacement: '/src/stores' },
        ],
    },
});
