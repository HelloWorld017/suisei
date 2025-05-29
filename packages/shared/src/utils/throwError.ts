import { E_STATE_NOT_IN_REGISTRY } from "../constants";
import {ErrorCode} from "../types/ErrorCode";

const ErrorMessages = {
  [E_STATE_NOT_IN_REGISTRY]: 'Given state $1 is not in the registry.',
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
