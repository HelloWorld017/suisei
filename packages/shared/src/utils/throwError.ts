import { E_INTERNAL_UNSUPPORTED_OPERATION } from '../constants';
import type { ErrorCode } from '../types/ErrorCode';

const ErrorMessages = {
  [E_INTERNAL_UNSUPPORTED_OPERATION]: '[Internal Error] Unsupported operation.',
} as const;

export const throwError = (code: ErrorCode, ...args: unknown[]): never => {
  if (__DEV__) {
    throw new Error(
      args.reduce<string>(
        (str, arg, index) => str.replace(`$${index}`, String(arg)),
        ErrorMessages[code]
      )
    );
  }

  throw new Error(`Minified error $${code}, args: ${JSON.stringify(args)}`);
};

export const throwWarn = (code: ErrorCode, ...args: unknown[]): void => {
  new Promise(() => throwError(code, ...args)).catch(console.warn);
};
