/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { codeInspectorPlugin } from 'code-inspector-plugin';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/client',
  server: {
    port: 4200,
    // host: '127.0.0.1',
    host: '0.0.0.0',
    //backend proxy
    proxy: {
      '/api': {
        target: process.env.BASE_URL,
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (p, o) => {
          //uncomment this line to log resolved URL of the proxied request.
          // p.on('proxyRes', (_, req) => { console.warn({proxiedURL: o.target!+req.url!}) });
          p.on('error', (err, req, res, target) => {
            if (err) {
              const api = new URL(`api${req.url}`, o.target as string);
              console.warn(`proxyURL :- ${api}`);
            }
          });
        },
      },
    },
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
    // ctrl+shift+click on dom el. to open code in vsc
    codeInspectorPlugin({ bundler: 'vite', hotKeys: ['ctrlKey', 'shiftKey'] }),
  ],
  //no need to set alias instead use nxViteTsPaths plugin
  resolve: {
    alias: {
      '@web': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: '../../dist/apps/client',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx,css}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/client',
      provider: 'v8',
    },
  },
});
