import { PIPELINE_UPDATE } from '../constants';
import { isDerivedRefInternal, isRef, isStateRefInternal } from './guards';
import type {
  ReactivityRegistry,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';

const recursivelyMarkRefAsPending = (
  registry: ReactivityRegistry,
  ref: Ref
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  internalRegistry._deps.traverse(ref, dependency => {
    internalRegistry._pending.add(dependency);
    if (isRef(dependency)) {
      recursivelyMarkRefAsPending(registry, dependency);
    }
  });
};

const propagateUpdateToBranch = <T>(
  registry: ReactivityRegistryBranchInternal,
  ref: Ref<T>
) => {
  // If the ref is dirty, ignore
  if (registry._dirty.has(ref)) {
    return;
  }

  // Mark as pending if it is a state ref
  if (isStateRefInternal(ref)) {
    recursivelyMarkRefAsPending(registry, ref);
  }

  // Unmark as pending if it is a derived ref
  if (isDerivedRefInternal(ref)) {
    registry._pending.delete(ref);
  }

  // Queue dependency tasks
  registry._deps.traverse(ref, (dependency, pipeline = PIPELINE_UPDATE) => {
    if (isRef(dependency) && registry._dirty.has(dependency)) {
      registry._tasks.insert(pipeline, dependency);
    }
  });
};

export const notifyUpdate = <T>(
  registry: ReactivityRegistry,
  ref: Ref<T>,
  nextValue: T
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;

  // Skip non-updates for derived
  if (isDerivedRefInternal(ref)) {
    if (
      internalRegistry._cache.has(ref) &&
      nextValue === internalRegistry._cache.get(ref)
    ) {
      return;
    }
  }

  // Skip non-updates for state, Mark pending state
  if (isStateRefInternal(ref)) {
    if (
      internalRegistry._stateDict.has(ref) &&
      nextValue === internalRegistry._stateDict.get(ref)
    ) {
      return;
    }

    recursivelyMarkRefAsPending(registry, ref);
  }

  // Propagate updates to branches
  if ('_branches' in internalRegistry) {
    internalRegistry._branches.forEach(branch => {
      propagateUpdateToBranch(branch, ref);
    });
  }

  // Mark as dirty
  if ('_dirty' in internalRegistry) {
    internalRegistry._dirty.add(ref);
  }

  // Queue dependency tasks
  internalRegistry._deps.traverse(
    ref,
    (dependency, pipeline = PIPELINE_UPDATE) => {
      if (!isRef(dependency)) {
        return internalRegistry._tasks.insert(pipeline, dependency);
      }

      if (internalRegistry._deps.isActive(dependency)) {
        return internalRegistry._tasks.insert(pipeline, dependency);
      }
    }
  );
};
