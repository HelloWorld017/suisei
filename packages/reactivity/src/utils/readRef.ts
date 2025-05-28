import { REF_KIND_DERIVED, SymbolRefDescriptor } from '@suisei/shared';
import type { ReactivityRegistry } from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';

export const readRef = <T>(registry: ReactivityRegistry, ref: Ref<T>): T => {
  const descriptor = (ref as RefInternal)[SymbolRefDescriptor];
  const isMemoizedRef =
    descriptor.kind === REF_KIND_DERIVED && descriptor.isMemoized;

  const deps = isMemoizedRef ? registry.openDeps(ref) : null;
  deps?.forEach(ref => deps.delete(ref));

  const selector = isMemoizedRef
    ? <T>(ref: Ref<T>) => {
        deps?.add(ref);
      }
    : (ref: Ref<T>) => readRef(registry, ref);
};
