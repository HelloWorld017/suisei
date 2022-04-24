export const enum ErrorCodes {
	E_NOT_REFERENCE,
	E_NOT_PROMISE,
};

export const ErrorMessages = {
	[ErrorCodes.E_NOT_REFERENCE]: 'Given value $1 is not a ref.',
	[ErrorCodes.E_NOT_PROMISE]: 'Given value $1 is not a promise.',
} as const;

export const throwError = (code: ErrorCodes, ...args: any[]): never => {
	throw new Error();
}
