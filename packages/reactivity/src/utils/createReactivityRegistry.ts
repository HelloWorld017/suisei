import {
  createOverlayMap,
  createOrderedSet,
  createOverlaySet,
} from '@suisei/shared';
import { createDependencyMap } from './createDependencyMap';
import type {
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryMainInternal,
  ReactivityRegistryMain,
} from '../types/ReactivityRegistry';

export const createReactivityRegistry = (): ReactivityRegistryMain => {
  const registry: ReactivityRegistryMainInternal = {
    _stateDict: new WeakMap(),
    _cache: new WeakMap(),
    _tasks: createOrderedSet(),
    _deps: createDependencyMap(),
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
    _deps: internalRegistry._deps.fork(),
    _pending: createOverlaySet(internalRegistry._pending),
    _dirty: new WeakSet(),
  };

  internalRegistry._branches.add(branch);
  return branch;
};
