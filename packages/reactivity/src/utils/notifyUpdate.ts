import { PIPELINE_EFFECT, PIPELINE_UPDATE } from '../constants';
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
  internalRegistry.deps.traverse(ref, dependency => {
    internalRegistry.pending.add(dependency);
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
  if (registry.dirty.has(ref)) {
    return;
  }

  // Mark as pending if it is a state ref
  if (isStateRefInternal(ref)) {
    recursivelyMarkRefAsPending(registry, ref);
  }

  // Unmark as pending if it is a derived ref
  if (isDerivedRefInternal(ref)) {
    registry.pending.delete(ref);
  }

  // Queue dependency tasks
  registry.deps.traverse(ref, (dependency, pipeline) => {
    if (isRef(dependency) && registry.dirty.has(dependency)) {
      registry.tasks.insert(pipeline ?? PIPELINE_UPDATE, dependency);
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
      internalRegistry.cache.has(ref) &&
      nextValue === internalRegistry.cache.get(ref)
    ) {
      return;
    }
  }

  // Skip non-updates for state, Mark pending state
  if (isStateRefInternal(ref)) {
    if (
      internalRegistry.stateDict.has(ref) &&
      nextValue === internalRegistry.stateDict.get(ref)
    ) {
      return;
    }

    recursivelyMarkRefAsPending(registry, ref);
  }

  // Propagate updates to branches
  if ('branches' in internalRegistry) {
    internalRegistry.branches.forEach(branch => {
      propagateUpdateToBranch(branch, ref);
    });
  }

  // Mark as dirty
  if ('dirty' in internalRegistry) {
    internalRegistry.dirty.add(ref);
  }

  // Queue dependency tasks
  internalRegistry.deps.traverse(ref, (dependency, pipeline) => {
    if (!isRef(dependency)) {
      return internalRegistry.tasks.insert(
        pipeline ?? PIPELINE_EFFECT,
        dependency
      );
    }

    if (internalRegistry.deps.isActive(dependency)) {
      return internalRegistry.tasks.insert(
        pipeline ?? PIPELINE_UPDATE,
        dependency
      );
    }
  });
};
