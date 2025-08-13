import { E_INTERNAL_UNSUPPORTED_OPERATION, throwError } from '@suisei/shared';
import { isStateRefInternal } from './guards';
import { notifyUpdate } from './notifyUpdate';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';

export const setState = <T>(
  registry: ReactivityRegistry,
  ref: Ref<T>,
  value: T
) => {
  if (!isStateRefInternal(ref)) {
    return throwError(E_INTERNAL_UNSUPPORTED_OPERATION);
  }

  const internalRegistry = registry as ReactivityRegistryInternal;
  notifyUpdate(registry, ref, value);
  internalRegistry._stateDict.set(ref, value);
};
