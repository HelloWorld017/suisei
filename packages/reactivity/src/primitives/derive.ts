import { SymbolIs, SymbolRef } from '@suisei/shared';
import type { DerivedRef, RefDerivator, Ref } from '../types';

export const derive: PrimitiveDerive = <T>(fn: RefDerivator<T>) => {
  (fn as DerivedRef<T>)[SymbolIs] = SymbolRef;
  return fn as DerivedRef<T>;
};

export type PrimitiveDerive = <T>(fn: RefDerivator<T>) => Ref<T>;
