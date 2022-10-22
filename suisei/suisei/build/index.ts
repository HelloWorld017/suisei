import { rollup } from 'rollup';
import dts from 'rollup-plugin-dts';
import { swc } from 'rollup-plugin-swc3';

const typesConfig = {
  plugins: [
    dts({
      compilerOptions: {
        paths: { '@/*': ['./dist/types/*'] },
      },
    }),
  ],
};

const defaultConfig = {
  plugins: [swc()],
};

// TODO
const builds = [];
builds.push(
  rollup({
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.esm.js',
        format: 'es',
      },
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
      },
    ],
    ...defaultConfig,
  })
);

builds.push(
  rollup({
    input: 'dist/types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    ...typesConfig,
  })
);

Promise.all(builds).catch(err => {
  console.error('Failed to build!', err);
});
