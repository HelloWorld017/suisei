import {
  createOverlayMap,
  REF_KIND_STATE,
  SymbolRefDescriptor,
  SymbolReactivityNoValue,
} from '@suisei/shared';
import type { Pipeline, PipelineManager } from '../types/PipelineManager';
import type {
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';
import type { Task } from '@suisei/core';

const readRef = <T>(
  registry: ReactivityRegistryInternal,
  ref: Ref<T>
): T | typeof SymbolReactivityNoValue => {
  const internalRef = ref as RefInternal<T>;
  if (internalRef[SymbolRefDescriptor].kind === REF_KIND_STATE) {
    return registry._stateDict.get(ref) as T;
  }

  if (registry._cache.has(ref)) {
    return registry._cache.get(ref) as T;
  }

  return SymbolReactivityNoValue;
};

const notifyUpdate = (registry: ReactivityRegistryInternal, ref: Ref) => {
  registry._deps
    .get(ref)
    ?.forEach((pipeline, task) =>
      registry._pipelineManager.queueTask(pipeline, task)
    );

  if ('_branches' in registry) {
    registry._branches.forEach(branch => {
      if (branch._dirty.has(ref)) {
        notifyUpdate(branch, ref);
      }
    });
  }
};

export const createReactivityRegistry = (pipelineManager: PipelineManager) => {
  const stateDict = new WeakMap<Ref, unknown>();
  const cache = new WeakMap<Ref, unknown>();
  const deps = new WeakMap<Ref, Map<Task, Pipeline>>();
  const branches = new Set<ReactivityRegistryBranchInternal>();

  const fork = (
    nextPipelineManager: PipelineManager = pipelineManager
  ): ReactivityRegistryBranch => {
    const branch: ReactivityRegistryBranchInternal = {
      _stateDict: createOverlayMap(stateDict),
      _cache: createOverlayMap(cache),
      _deps: createOverlayMap(deps),
      _dirty: new WeakSet<Ref>(),
      _pipelineManager: nextPipelineManager,
      read: ref => readRef(branch, ref),
      writeState: (ref, value) => {},
      writeCache: (ref, value) => {},
      commit: () => {},
      dispose: () => {
        nextPipelineManager.dispose();
      },
    };

    return branch;
  };
};
