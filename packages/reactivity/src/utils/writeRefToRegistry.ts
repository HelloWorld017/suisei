import { PIPELINE_UPDATE } from '../constants';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';

const notifyUpdate = (registry: ReactivityRegistryInternal, ref: Ref) => {
  registry._deps
    .get(ref)
    ?.forEach(ref => registry._tasks.insert(PIPELINE_UPDATE, ref));

  registry._effects
    .get(ref)
    ?.forEach((pipeline, effect) => registry._tasks.insert(pipeline, effect));

  if ('_branches' in registry) {
    registry._branches.forEach(branch => {
      if (branch._dirty.has(ref)) {
        notifyUpdate(branch, ref);
      }
    });
  }
};

export const writeRefStateToRegistry = <T>(
  registry: ReactivityRegistry,
  ref: Ref<T>,
  value: T
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  internalRegistry._stateDict.set(ref, value);
  notifyUpdate(internalRegistry, ref);
};

export const writeCacheToRegistry = <T>(
  registry: ReactivityRegistry,
  ref: Ref<T>,
  value: T
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;

  internalRegistry._cache.set(ref, value);
  notifyUpdate(internalRegistry, ref);
};
