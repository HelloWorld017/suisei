import {
  createOverlayMap,
  createOrderedSet,
  createOverlaySet,
} from '@suisei/shared';
import { createDependencyMap } from './createDependencyMap';
import { forkDependencyMap } from './forkDependencyMap';
import { isRef } from './guards';
import type { Pipeline } from '../types/Pipeline';
import type {
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryMainInternal,
  ReactivityRegistryMain,
  EffectTask,
  ReactivityRegistryInternal,
  BindTarget,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';
import type { Scheduler } from '@suisei/core';

const disposeDependency = (
  registry: ReactivityRegistryInternal,
  target: BindTarget
) => {
  registry._tasks.delete(target);
  registry._pending.delete(target);

  if (isRef(target)) {
    registry._cache.delete(target);
  }
};

export const createReactivityRegistry = (
  scheduler: Scheduler
): ReactivityRegistryMain => {
  const registry: ReactivityRegistryMainInternal = {
    _stateDict: new WeakMap(),
    _cache: new WeakMap(),
    _tasks: createOrderedSet(),
    _deps: createDependencyMap<Ref, EffectTask, Pipeline>(scheduler, ref =>
      disposeDependency(registry, ref)
    ),
    _branches: new Set(),
    _pending: new WeakSet(),
  };

  return registry;
};

export const forkRegistry = (
  registry: ReactivityRegistryMain
): ReactivityRegistryBranch => {
  const internalRegistry = registry as ReactivityRegistryMainInternal;
  const branch: ReactivityRegistryBranchInternal = {
    _stateDict: createOverlayMap(internalRegistry._stateDict),
    _cache: createOverlayMap(internalRegistry._cache),
    _tasks: createOrderedSet(),
    _deps: forkDependencyMap(internalRegistry._deps),

    // TODO check if it is safe to use OverlaySet, instead of new Set(_pending)
    _pending: createOverlaySet(internalRegistry._pending),
    _dirty: new WeakSet(),
  };

  internalRegistry._branches.add(branch);
  return branch;
};
