import alias from '@rollup/plugin-alias';
import { defineConfig, Plugin } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const input = {
  client: resolve(root, './client.ts'),
  server: resolve(root, './server.ts'),
};

const external = ['suisei', /^suisei\//, /^node:/];

const aliasConfig = {
  entries: [
    {
      find: /^@suisei-dom\/([a-z-]+)/,
      replacement: join(resolve(root, '..'), '$1/src/index.ts'),
    },
  ],
};

const esbuildConfig = {
  target: 'es2016',
};

const prodConfig = defineConfig({
  input,
  output: [
    {
      chunkFileNames: 'cjs/chunks/chunks-[hash].prod.js',
      entryFileNames: 'cjs/[name].prod.js',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      chunkFileNames: 'esm/chunks/chunks-[hash].prod.js',
      entryFileNames: 'esm/[name].prod.js',
      dir: dist,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    alias(aliasConfig),
    esbuild({
      ...esbuildConfig,
      define: {
        __DEV__: JSON.stringify(false),
      },
    }),
    terser(),
  ] as Plugin[],
});

const umdConfig = defineConfig({
  input: input.client,
  output: [
    {
      name: 'SuiseiDOM',
      file: resolve(dist, 'umd/suisei-dom.min.js'),
      format: 'umd',
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    alias(aliasConfig),
    esbuild({
      ...esbuildConfig,
      define: {
        __DEV__: JSON.stringify(false),
      },
    }),
    terser(),
  ] as Plugin[],
});

const devConfig = defineConfig({
  input,
  output: [
    {
      chunkFileNames: 'cjs/chunks/chunks-[hash].dev.cjs',
      entryFileNames: 'cjs/[name].dev.js',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      chunkFileNames: 'esm/chunks/chunks-[hash].dev.mjs',
      entryFileNames: 'esm/[name].dev.js',
      dir: dist,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external,
  plugins: [
    alias(aliasConfig),
    esbuild({
      ...esbuildConfig,
      define: {
        __DEV__: JSON.stringify(true),
      },
    }),
  ] as Plugin[],
});

const typeRoot = resolve(dist, 'typeRoot');
const typesConfig = defineConfig({
  input: {
    client: resolve(typeRoot, 'suisei-dom/client.d.ts'),
    server: resolve(typeRoot, 'suisei-dom/server.d.ts'),
  },
  output: {
    entryFileNames: '[name].d.ts',
    chunkFileNames: 'types/chunks/chunks-[hash].d.ts',
    dir: dist,
    format: 'esm',
  },
  external,
  plugins: [
    alias({
      entries: [
        {
          find: /^@suisei-dom\/([a-z-]+)/,
          replacement: join(typeRoot, '$1/src/index.d.ts'),
        },
      ],
    }),
    dts(),
  ] as Plugin[],
});

// eslint-disable-next-line import/no-default-export
export default [prodConfig, umdConfig, devConfig, typesConfig];
