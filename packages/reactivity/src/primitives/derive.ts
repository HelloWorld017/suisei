import { SymbolIs, SymbolRef } from '@suisei/shared';
import type { DerivedRef, RefDerivator } from '../types';

export const derive = <T>(fn: RefDerivator<T>): DerivedRef<T> => {
	(fn as DerivedRef<T>)[SymbolIs] = SymbolRef;
	return fn as DerivedRef<T>;
};
