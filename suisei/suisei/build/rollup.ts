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
      chunkFileNames: 'cjs/chunks-[hash].prod.cjs',
      entryFileNames: '[name].prod.cjs',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'suisei',
      chunkFileNames: 'esm/chunks-[hash].prod.mjs',
      entryFileNames: '[name].prod.mjs',
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
      chunkFileNames: 'cjs/chunks-[hash].dev.cjs',
      entryFileNames: '[name].dev.cjs',
      dir: dist,
      format: 'cjs',
      sourcemap: true,
    },
    {
      name: 'suisei',
      chunkFileNames: 'esm/chunks-[hash].dev.mjs',
      entryFileNames: '[name].dev.mjs',
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

const typesConfig = defineConfig({
  input: 'dist/types/index.d.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es',
  },
  plugins: [
    dts({
      compilerOptions: {
        paths: { '@/*': ['./dist/types/*'] },
      },
    }),
  ],
});

// eslint-disable-next-line import/no-default-export
export default [prodConfig, devConfig, typesConfig];
