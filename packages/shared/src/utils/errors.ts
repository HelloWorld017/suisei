export const enum ErrorCodes {
  E_NOT_REFERENCE,
  E_NOT_PROMISE,
  E_NOT_ELEMENT,
  E_SET_ON_DECOMPOSE,
  E_KEY_NONCONSTANT_REF,
}

export const ErrorMessages = {
  [ErrorCodes.E_NOT_REFERENCE]: 'Given value $1 is not a ref.',
  [ErrorCodes.E_NOT_ELEMENT]: 'Given value $1 is not an element.',
  [ErrorCodes.E_NOT_PROMISE]: 'Given value $1 is not a promise.',
  [ErrorCodes.E_SET_ON_DECOMPOSE]: 'Tried to set key $1 to a decomposed ref',
  [ErrorCodes.E_KEY_NONCONSTANT_REF]:
    'Must use constant for the key prop, ref given',
} as const;

export const throwError = (code: ErrorCodes, ...args: unknown[]): never => {
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
