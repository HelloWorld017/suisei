import { E_STATE_NOT_IN_REGISTRY, REF_KIND_DERIVED, SymbolReactivityNoValue, SymbolRefDescriptor, throwError } from '@suisei/shared';
import type { ReactivityRegistry } from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';
import {readMemoizedDepsFromRegistry, readRefFromRegistry, updateDepsToRegistry, writeCacheToRegistry} from './createReactivityRegistry';

const diffMemoizedDeps = (registry: ReactivityRegistry, deps: Map<Ref, unknown>) => {
  let isEqual = true;
  deps.forEach((value, ref) => {
    isEqual &&= (readLatestRef(registry, ref) === value);
  });

  return isEqual;
};

export const readLatestRef = <T>(registry: ReactivityRegistry, ref: Ref<T>): T => {
  const descriptor = (ref as RefInternal)[SymbolRefDescriptor];
  const isDerivedRef = descriptor.kind === REF_KIND_DERIVED;
  const isMemoizedRef =
    isDerivedRef && descriptor.isMemoized;

  const previousMemoizedDeps = readMemoizedDepsFromRegistry(registry, ref);
  const shouldUpdateMemo = isMemoizedRef && (!previousMemoizedDeps || diffMemoizedDeps(registry, previousMemoizedDeps));

  const previousValue = readRefFromRegistry(registry, ref);
  if (!shouldUpdateMemo && previousValue !== SymbolReactivityNoValue) {
    return previousValue;
  }

  const nextDeps = isMemoizedRef ? new Set<Ref>() : null;
  const nextMemoizedDeps = isMemoizedRef ? new Map<Ref, unknown>() : null;
  const selector = isMemoizedRef
    ? <TValue>(ref: Ref<TValue>) => {
        nextDeps?.add(ref);

        const value = readLatestRef(registry, ref);
        nextMemoizedDeps?.set(ref, value);
        return value;

      }
    : <TValue>(ref: Ref<TValue>) => readLatestRef(registry, ref);

  if (isDerivedRef) {
    const value = descriptor.derive(selector);

    if (isMemoizedRef) {
      updateDepsToRegistry(registry, ref, nextDeps!);
      writeCacheToRegistry(registry, ref, value);
    }

    return value as T;
  }

  return throwError(E_STATE_NOT_IN_REGISTRY);
};
