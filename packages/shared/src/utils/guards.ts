import { ErrorCodes, throwError } from './errors';
import { SymbolRef } from '../constants';
import type { Ref } from '@suisei/reactivity';

export const isRef = <T>(ref: unknown): ref is Ref<T> =>
	typeof ref === 'object' && (ref as Ref<T>)?.is === SymbolRef;

type AssertsIsRef = <T>(ref: unknown) => asserts ref is Ref<T>;
export const assertsIsRef: AssertsIsRef = <T>(ref: unknown) => {
	if (!isRef<T>(ref)) {
		throwError(ErrorCodes.E_NOT_REFERENCE, ref);
	}
};

export const isPromise = <T>(obj: unknown): obj is Promise<T> =>
	(typeof obj === 'object' || typeof obj === 'function') && typeof (obj as Promise<T>)?.then === 'function';

type AssertsIsPromise = <T>(obj: unknown) => asserts obj is Promise<T>;
export const assertsIsPromise: AssertsIsPromise = <T>(obj: unknown) => {
	if (!isPromise<T>(obj)) {
		throwError(ErrorCodes.E_NOT_PROMISE, obj);
	}
};
