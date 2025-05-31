import {
  E_STATE_NOT_IN_REGISTRY,
  SymbolReactivityNoValue,
  SymbolRefDescriptor,
  throwError,
} from '@suisei/shared';
import {
  readRefFromRegistry,
  updateDepsToRegistry,
  writeCacheToRegistry,
} from './createReactivityRegistry';
import { isDerivedRefInternal } from './isDerivedRefInternal';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { DerivedRefInternal, Ref, RefInternal } from '../types/Ref';

export const readRef = <T>(registry: ReactivityRegistry, ref: Ref<T>): T => {
  const internalRef = ref as RefInternal<T>;

  if (!isDerivedRefInternal(internalRef)) {
    const stateValue = readRefFromRegistry(registry, ref);
    if (stateValue === SymbolReactivityNoValue) {
      return throwError(E_STATE_NOT_IN_REGISTRY);
    }

    return stateValue;
  }

  if (!internalRef[SymbolRefDescriptor].isMemoized) {
    const selector = <TValue>(ref: Ref<TValue>) => readRef(registry, ref);
    return internalRef[SymbolRefDescriptor].derive(selector);
  }

  const cache = readRefFromRegistry(registry, ref);
  if (cache !== SymbolReactivityNoValue) {
    return cache;
  }

  return readRefByUpdate(registry, internalRef);
};

export const readRefByUpdate = <T>(
  registry: ReactivityRegistry,
  ref: DerivedRefInternal<T>
): T => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  const nextDeps = new Set<Ref>();
  const selector = <TValue>(ref: Ref<TValue>) => {
    if ('_dirty' in internalRegistry) {
      internalRegistry._dirty.add(ref);
    }

    nextDeps.add(ref);
    return readRef(registry, ref);
  };

  const value = ref[SymbolRefDescriptor].derive(selector);
  updateDepsToRegistry(registry, ref, nextDeps);
  writeCacheToRegistry(registry, ref, value);

  return value;
};
