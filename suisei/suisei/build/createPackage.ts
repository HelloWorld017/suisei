import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const createExports = (path: string, entry: string) => ({
  [path]: {
    types: `./dist/types/${entry}.d.ts`,
    development: {
      import: `./dist/esm/${entry}.dev.js`,
      require: `./dist/cjs/${entry}.dev.js`,
    },
    production: {
      import: `./dist/esm/${entry}.prod.js`,
      require: `./dist/cjs/${entry}.prod.js`,
    },
    import: `./dist/esm/${entry}.dev.js`,
    require: `./dist/cjs/${entry}.js`,
  },
});

const createTypesVersions = (path: string, entry: string) => ({
  [path]: [`./dist/types/${entry}.d.ts`],
});

type PackageJson = Record<string, unknown>;
const createPackageJson = async (): Promise<PackageJson> => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const packageJsonRaw = await fs.readFile(
    join(__dirname, '../package.json'),
    'utf8'
  );

  const packageJson = JSON.parse(packageJsonRaw) as PackageJson;

  return {
    ...packageJson,
    devDependencies: {},
    scripts: {},
    main: './dist/cjs/suisei.js',
    types: './dist/types/suisei.d.ts',
    typesVersions: {
      '*': {
        ...createTypesVersions('index.d.ts', 'suisei'),
        ...createTypesVersions('jsx-runtime.d.ts', 'jsx-runtime'),
        ...createTypesVersions('unsafe-internals.d.ts', 'unsafe-internals'),
      },
    },
    browser: './dist/umd/suisei.umd.js',
    exports: {
      ...createExports('./', 'suisei'),
      ...createExports('./jsx-runtime', 'jsx-runtime'),
      ...createExports('./unsafe-internals', 'unsafe-internals'),
    },
  };
};

const createConditionalImport = (entry: string) =>
  `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./${entry}.prod.js');
} else {
  module.exports = require('./${entry}.dev.js');
}
`.trim();

(async () => {
  await fs.mkdir('./dist/types', { recursive: true });

  // Write Package
  const packageJson = await createPackageJson();
  await fs.writeFile(
    './dist/package.json',
    JSON.stringify(packageJson, null, 2)
  );

  // Write CJS Files
  await fs.mkdir('./dist/cjs', { recursive: true });

  // prettier-ignore
  await Promise.all([
    fs.writeFile(
      './dist/cjs/package.json',
      JSON.stringify({ type: 'commonjs' }, null, 2)
    ),

    fs.writeFile(
      './dist/cjs/index.js',
      createConditionalImport('suisei')
    ),

    fs.writeFile(
      './dist/cjs/jsx-runtime.js',
      createConditionalImport('jsx-runtime')
    ),

    fs.writeFile(
      './dist/cjs/unsafe-internals.js',
      createConditionalImport('unsafe-internals')
    ),
  ]);
})().catch(err => {
  console.error(err);
});
