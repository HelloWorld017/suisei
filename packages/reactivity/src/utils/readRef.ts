import { SymbolRefDescriptor } from '@suisei/shared';
import { isConstantRefInternal, isStateRefInternal } from './guards';
import { notifyUpdate } from './notifyUpdate';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type {
  DerivedRefInternal,
  ReadwriteRefInternal,
  Ref,
  RefInternal,
} from '../types/Ref';

export const readRef = <T>(registry: ReactivityRegistry, ref: Ref<T>): T => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  const internalRef = ref as RefInternal<T>;

  // When it is a state ref
  if (isStateRefInternal(internalRef)) {
    return internalRegistry._stateDict.get(ref) as T;
  }

  // When it is a constant ref
  if (isConstantRefInternal(internalRef)) {
    return internalRef[SymbolRefDescriptor].value;
  }

  // When it is a derived ref and has latest cache
  if (
    internalRef[SymbolRefDescriptor].isMemoized &&
    internalRegistry._cache.has(ref) &&
    !internalRegistry._pending.has(ref)
  ) {
    return internalRegistry._cache.get(ref) as T;
  }

  // When it is a derived ref and not memoized
  if (!internalRef[SymbolRefDescriptor].isMemoized) {
    const selector = <T>(selected: Ref<T>) => {
      internalRegistry._deps.add(selected, ref);
      return readRef(registry, selected);
    };

    return internalRef[SymbolRefDescriptor].derive(selector);
  }

  return updateRef(registry, internalRef);
};

const updateRef = <T>(
  registry: ReactivityRegistry,
  ref: ReadwriteRefInternal<T> | DerivedRefInternal<T>
): T => {
  const internalRegistry = registry as ReactivityRegistryInternal;

  const depsKey = internalRegistry._deps.rewrite(ref);
  const selector = <TValue>(selected: Ref<TValue>) => {
    internalRegistry._deps.add(selected, ref, undefined, depsKey);
    return readRef(registry, selected);
  };

  const value = ref[SymbolRefDescriptor].derive(selector);
  notifyUpdate(registry, ref, value);
  internalRegistry._cache.set(ref, value);

  return value;
};
