import { createOverlayMap, createOrderedSet } from '@suisei/shared';
import type { Pipeline } from '../types/Pipeline';
import type {
  EffectTask,
  DisposeTask,
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryInternal,
  ReactivityRegistryMainInternal,
} from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';

const addEffect = (
  registry: ReactivityRegistryInternal,
  ref: Ref,
  effectTask: EffectTask,
  disposeTask: DisposeTask,
  pipeline: Pipeline
) => {
  let effects = registry._effects.get(ref);
  if (!effects) {
    effects = new Map();
    registry._effects.set(ref, effects);
  }

  effects.set(effectTask, pipeline);

  if ('_effectsActive' in registry) {
    registry._effectsActive.set(effectTask, disposeTask);
  }
};

const removeEffect = (
  registry: ReactivityRegistryInternal,
  ref: Ref,
  effectTask: EffectTask
) => {
  registry._effects.get(ref)?.delete(effectTask);
  if ('_effectsActive' in registry) {
    registry._effectsActive.delete(effectTask);
  }
};

export const createReactivityRegistry = () => {
  const stateDict = new WeakMap<Ref, unknown>();
  const cache = new WeakMap<Ref, unknown>();
  const deps = new WeakMap<Ref, Set<Ref>>();
  const memoizedDeps = new WeakMap<Ref, unknown[]>();
  const effects = new WeakMap<Ref, Map<EffectTask, Pipeline>>();
  const branches = new Set<ReactivityRegistryBranchInternal>();

  const fork = (): ReactivityRegistryBranch => {
    const branch: ReactivityRegistryBranchInternal = {
      _stateDict: createOverlayMap(stateDict),
      _cache: createOverlayMap(cache),
      _tasks: createOrderedSet(),
      _deps: createOverlayMap(deps),
      _memoizedDeps: createOverlayMap(memoizedDeps),
      _effects: createOverlayMap(effects),
      _effectsActive: new Map(),
      _dirty: new WeakSet(),
      addEffect: (ref, effectTask, disposeTask, pipeline) =>
        addEffect(branch, ref, effectTask, disposeTask, pipeline),
      removeEffect: (ref, effectTask) => removeEffect(branch, ref, effectTask),
      updateDeps: (ref, deps) => branch._deps.set(ref, deps),
      readMemoizedDeps: ref => branch._memoizedDeps.get(ref) ?? null,
    };

    branches.add(branch);
    return branch;
  };

  const registry: ReactivityRegistryMainInternal = {
    _stateDict: stateDict,
    _cache: cache,
    _tasks: createOrderedSet(),
    _deps: deps,
    _memoizedDeps: memoizedDeps,
    _effects: effects,
    _branches: branches,
    writeState: (ref, value) => {
      registry._stateDict.set(ref, value);
      notifyUpdate(registry, ref);
    },
    writeCache: (ref, value) => {
      registry._cache.set(ref, value);
      notifyUpdate(registry, ref);
    },
    addEffect: (ref, effectTask, disposeTask, pipeline) =>
      addEffect(registry, ref, effectTask, disposeTask, pipeline),
    removeEffect: (ref, effectTask) => removeEffect(registry, ref, effectTask),
    updateDeps: (ref, deps) => registry._deps.set(ref, deps),
    readMemoizedDeps: ref => memoizedDeps.get(ref) ?? null,
    fork,
  };

  return registry;
};
