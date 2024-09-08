import { Config } from 'typescript-eslint';

declare module 'eslint-plugin-no-autofix' {
  export const config: Config;
}
