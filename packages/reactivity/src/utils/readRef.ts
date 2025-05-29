import {
  REF_KIND_DERIVED,
  REF_KIND_STATE,
  SymbolReactivityNoValue,
  SymbolRefDescriptor,
} from '@suisei/shared';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';

export const readRefFromRegistry = <T>(
  registry: ReactivityRegistryInternal,
  ref: Ref<T>
): T | typeof SymbolReactivityNoValue => {
  const internalRef = ref as RefInternal<T>;
  if (internalRef[SymbolRefDescriptor].kind === REF_KIND_STATE) {
    return registry._stateDict.get(ref) as T;
  }

  if (registry._cache.has(ref)) {
    return registry._cache.get(ref) as T;
  }

  return SymbolReactivityNoValue;
};

export const readRef = <T>(registry: ReactivityRegistry, ref: Ref<T>): T => {
  const descriptor = (ref as RefInternal)[SymbolRefDescriptor];
  const isMemoizedRef =
    descriptor.kind === REF_KIND_DERIVED && descriptor.isMemoized;

  const deps = isMemoizedRef ? new Set() : null;
  const selector = isMemoizedRef
    ? <T>(ref: Ref<T>) => {
        deps?.add(ref);
        const value = readRef(registry, ref);
      }
    : (ref: Ref<T>) => readRef(registry, ref);
};
