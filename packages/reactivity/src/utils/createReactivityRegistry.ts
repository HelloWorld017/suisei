import {
  createOverlayMap,
  createOrderedSet,
  createOverlaySet,
} from '@suisei/shared';
import { createDependencyMap } from './createDependencyMap';
import { forkDependencyMap } from './forkDependencyMap';
import { isRef } from './guards';
import type { EffectTask } from '../types/Effect';
import type { Pipeline } from '../types/Pipeline';
import type {
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryMainInternal,
  ReactivityRegistryMain,
  ReactivityRegistryInternal,
  BindTarget,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';
import type { Scheduler } from '@suisei/core';

const disposeDependency = (
  registry: ReactivityRegistryInternal,
  target: BindTarget
) => {
  registry.tasks.delete(target);
  registry.pending.delete(target);

  if (isRef(target)) {
    registry.cache.delete(target);
  }
};

export const createReactivityRegistry = (
  scheduler: Scheduler
): ReactivityRegistryMain => {
  const registry: ReactivityRegistryMainInternal = {
    stateDict: new WeakMap(),
    cache: new WeakMap(),
    tasks: createOrderedSet(),
    deps: createDependencyMap<Ref, EffectTask, Pipeline>(scheduler, ref =>
      disposeDependency(registry, ref)
    ),
    branches: new Set(),
    pending: new WeakSet(),
  };

  return registry;
};

export const forkRegistry = (
  registry: ReactivityRegistryMain
): ReactivityRegistryBranch => {
  const internalRegistry = registry as ReactivityRegistryMainInternal;
  const branch: ReactivityRegistryBranchInternal = {
    stateDict: createOverlayMap(internalRegistry.stateDict),
    cache: createOverlayMap(internalRegistry.cache),
    tasks: createOrderedSet(),
    deps: forkDependencyMap(internalRegistry.deps),

    // TODO check if it is safe to use OverlaySet, instead of new Set(_pending)
    pending: createOverlaySet(internalRegistry.pending),
    dirty: new WeakSet(),
  };

  internalRegistry.branches.add(branch);
  return branch;
};
