import fs from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const createExports = (path: string, entry: string) => ({
  [path]: {
    types: `./types/${entry}.d.ts`,
    development: {
      import: `./esm/${entry}.dev.js`,
      require: `./cjs/${entry}.dev.js`,
    },
    production: {
      import: `./esm/${entry}.prod.js`,
      require: `./cjs/${entry}.prod.js`,
    },
    import: `./esm/${entry}.dev.js`,
    require: `./cjs/${entry}.js`,
  },
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
    name: 'suisei-dom',
    devDependencies: {},
    scripts: {},
    main: './cjs/server.js',
    types: './server.d.ts',
    browser: './umd/client.min.js',
    exports: {
      ...createExports('./client', 'client'),
      ...createExports('./server', 'server'),
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
      './dist/cjs/client.js',
      createConditionalImport('client')
    ),

    fs.writeFile(
      './dist/cjs/server.js',
      createConditionalImport('server')
    ),
  ]);
})().catch(err => {
  console.error(err);
});
