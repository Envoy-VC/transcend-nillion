/* eslint-disable @typescript-eslint/no-unsafe-return -- safe */
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { type ViteDevServer, defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const wasmContentTypePlugin = () => {
  return {
    name: 'wasm-content-type-plugin',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
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
    port: 3000,
  },
  plugins: [react(), wasm(), topLevelAwait(), wasmContentTypePlugin()],
  optimizeDeps: {
    include: ['shiki'],
    exclude: ['@nillion/nillion-client-js-browser'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib',
      util: 'util',
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
