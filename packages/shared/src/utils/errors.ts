import { SymbolIs, SymbolSuspendDerivation } from '@suisei/shared';
export const enum ErrorCodes {
	E_NOT_REFERENCE,
	E_NOT_PROMISE,
	E_SET_ON_DECOMPOSE,
};

export const ErrorMessages = {
	[ErrorCodes.E_NOT_REFERENCE]: 'Given value $1 is not a ref.',
	[ErrorCodes.E_NOT_PROMISE]: 'Given value $1 is not a promise.',
	[ErrorCodes.E_SET_ON_DECOMPOSE]: 'Tried to set key $1 to a decomposed ref',
} as const;

export const throwError = (code: ErrorCodes, ...args: any[]): never => {
	throw new Error();
};

export class SuspendDerivation extends Error {
	[SymbolIs] = SymbolSuspendDerivation;
}
