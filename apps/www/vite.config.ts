import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { defineConfig, type ViteDevServer } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

import dotenv from 'dotenv';

import react from '@vitejs/plugin-react';
import path from 'node:path';

dotenv.config({ path: '.env.local' });

const wasmContentTypePlugin = () => {
  return {
    name: 'wasm-content-type-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        if (req.url?.endsWith('.wasm')) {
          res.setHeader('Content-Type', 'application/wasm');
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    wasmContentTypePlugin(),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
  ],
  optimizeDeps: {
    exclude: ['@nillion/nillion-client-js-browser'],
  },
  assetsInclude: ['**/nillion-client-js-browser/*.wasm'],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  worker: {
    plugins: () => [wasm(), topLevelAwait(), wasmContentTypePlugin()],
  },
});
