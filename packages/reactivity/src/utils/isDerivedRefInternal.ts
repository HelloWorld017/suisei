import { REF_KIND_DERIVED, SymbolRefDescriptor } from '@suisei/shared';
import type { DerivedRefInternal, Ref, RefInternal } from '../types/Ref';

export const isDerivedRefInternal = <T>(
  ref: Ref<T>
): ref is DerivedRefInternal<T> =>
  (ref as RefInternal<T>)[SymbolRefDescriptor].kind === REF_KIND_DERIVED;
