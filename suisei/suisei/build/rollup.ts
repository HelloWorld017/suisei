import alias from '@rollup/plugin-alias';
import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const dist = resolve(root, 'dist');

const input = {
  'index': resolve(root, './index.ts'),
  'jsx-runtime': resolve(root, './jsx-runtime.ts'),
  'unsafe-internals': resolve(root, './unsafe-internals.ts'),
};

const aliasConfig = {
  entries: [
    {
      find: /^@suisei\/([a-z-]+)/,
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
      name: 'suisei',
      chunkFileNames: 'cjs/chunks/chunks-[hash].prod.js',
      entryFileNames: 'cjs/[name].prod.js',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'suisei',
      chunkFileNames: 'esm/chunks/chunks-[hash].prod.js',
      entryFileNames: 'esm/[name].prod.js',
      dir: dist,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    alias(aliasConfig),
    esbuild({
      ...esbuildConfig,
      define: {
        __DEV__: JSON.stringify(false),
      },
    }),
    terser(),
  ],
});

const devConfig = defineConfig({
  input,
  output: [
    {
      name: 'suisei',
      chunkFileNames: 'cjs/chunks/chunks-[hash].dev.cjs',
      entryFileNames: 'cjs/[name].dev.js',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'suisei',
      chunkFileNames: 'esm/chunks/chunks-[hash].dev.mjs',
      entryFileNames: 'esm/[name].dev.js',
      dir: dist,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    alias(aliasConfig),
    esbuild({
      ...esbuildConfig,
      define: {
        __DEV__: JSON.stringify(true),
      },
    }),
  ],
});

const typeRoot = resolve(dist, 'typeRoot');
const typesConfig = defineConfig({
  input: {
    'index': resolve(typeRoot, 'suisei/index.d.ts'),
    'jsx-runtime': resolve(typeRoot, 'suisei/jsx-runtime.d.ts'),
    'unsafe-internals': resolve(typeRoot, 'suisei/unsafe-internals.d.ts'),
  },
  output: {
    name: 'suisei',
    entryFileNames: 'types/[name].d.ts',
    chunkFileNames: 'types/chunks/chunks-[hash].d.ts',
    dir: dist,
    format: 'esm',
  },
  plugins: [
    alias({
      entries: [
        {
          find: /^@suisei\/([a-z-]+)/,
          replacement: join(typeRoot, '$1/src/index.d.ts'),
        },
      ],
    }),
    dts(),
  ],
});

// eslint-disable-next-line import/no-default-export
export default [prodConfig, devConfig, typesConfig];
