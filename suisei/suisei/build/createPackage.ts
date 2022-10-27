import package from '../package.json';

const createExports = (path: string, entry: string) => ({
  [path]: {
    development: {
      import: {
        types: `./dist/types/${entry}.d.ts`,
        default: `./dist/esm/${entry}.dev.js`,
      },
      require: `./dist/cjs/${entry}.dev.js`,
    },
    import: {
      types: `./dist/types/${entry}.d.ts`,
      default: `./dist/esm/${entry}.prod.js`,
    },
    require: `./dist/cjs/${entry}.js`,
  },
});

const createPackage = () => ({
  ...package,
  devDependencies: {},
  scripts: {},
  main: './dist/cjs/suisei.js',
  types: './dist/types/suisei.d.ts',
  typeVersions: {
    // TODO
  },
  browser: './dist/umd/suisei.umd.js',
  exports: {
    ...createExports('./', 'suisei'),
    ...createExports('./jsx-runtime', 'jsx-runtime'),
    ...createExports('./unsafe-internals', 'unsafe-internals'),
  },
});

const createConditionalImport = (entry: string) =>
  `
'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${entry}.prod.cjs');
} else {
  module.exports = require('./${entry}.dev.cjs');
}
`.trim();
