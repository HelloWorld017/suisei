import { ErrorCodes, throwError } from './errors';
import { SymbolIs, SymbolRef, SymbolRefDescriptor } from '../constants';
import type { ConstantRef, DerivedRef, Ref, VariableRef } from '@suisei/reactivity';

export const isConstantOrVariableRef = <T>(ref: unknown): ref is (ConstantRef<T> | VariableRef<T>) =>
	typeof ref === 'object' && (ref as ConstantRef<T> | VariableRef<T>)?.[SymbolIs] === SymbolRef;

export const isConstantRef = <T>(ref: unknown): ref is ConstantRef<T> =>
	isConstantOrVariableRef(ref) && ref[SymbolRefDescriptor].isConstant === true;

export const isVariableRef = <T>(ref: unknown): ref is VariableRef<T> =>
	isConstantOrVariableRef(ref) && ref[SymbolRefDescriptor].isConstant === false;

export const isDerivedRef = <T>(ref: unknown): ref is DerivedRef<T> =>
	typeof ref === 'function' && (ref as DerivedRef<T>)[SymbolIs] === SymbolRef;

export const isRef = <T>(ref: unknown): ref is Ref<T> =>
	(ref as Ref<T>)?.[SymbolIs] === SymbolRef;

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
