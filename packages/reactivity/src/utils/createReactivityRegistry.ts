import {
  createOverlayMap,
  createOrderedSet,
  SymbolReactivityNoValue,
  SymbolRefDescriptor,
  REF_KIND_STATE,
} from '@suisei/shared';
import { PIPELINE_UPDATE } from '../constants';
import type { Pipeline } from '../types/Pipeline';
import type {
  EffectTask,
  DisposeTask,
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryInternal,
  ReactivityRegistryMainInternal,
  ReactivityRegistry,
  ReactivityRegistryMain,
} from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';

export const createReactivityRegistry = (): ReactivityRegistryMainInternal => ({
  _stateDict: new WeakMap(),
  _cache: new WeakMap(),
  _tasks: createOrderedSet(),
  _deps: new WeakMap(),
  _memoizedDeps: new WeakMap(),
  _effects: new WeakMap(),
  _branches: new Set(),
});

export const readRefFromRegistry = <T>(
  registry: ReactivityRegistry,
  ref: Ref<T>
): T | typeof SymbolReactivityNoValue => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  const internalRef = ref as RefInternal<T>;
  if (internalRef[SymbolRefDescriptor].kind === REF_KIND_STATE) {
    return internalRegistry._stateDict.get(ref) as T;
  }

  if (internalRegistry._cache.has(ref)) {
    return internalRegistry._cache.get(ref) as T;
  }

  return SymbolReactivityNoValue;
};

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

export const writeStateToRegistry = <T>(
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

export const addEffectToRegistry = (
  registry: ReactivityRegistry,
  ref: Ref,
  effectTask: EffectTask,
  disposeTask: DisposeTask,
  pipeline: Pipeline
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;

  let effects = internalRegistry._effects.get(ref);
  if (!effects) {
    effects = new Map();
    internalRegistry._effects.set(ref, effects);
  }

  effects.set(effectTask, pipeline);

  if ('_effectsActive' in internalRegistry) {
    internalRegistry._effectsActive.set(effectTask, disposeTask);
  }
};

export const removeEffectFromRegistry = (
  registry: ReactivityRegistryInternal,
  ref: Ref,
  effectTask: EffectTask
) => {
  const internalRegistry = registry;

  internalRegistry._effects.get(ref)?.delete(effectTask);
  if ('_effectsActive' in internalRegistry) {
    internalRegistry._effectsActive.delete(effectTask);
  }
};

export const updateDepsToRegistry = (
  registry: ReactivityRegistry,
  ref: Ref,
  deps: Set<Ref>
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  internalRegistry._deps.set(ref, deps);
};

export const readMemoizedDepsFromRegistry = (
  registry: ReactivityRegistry,
  ref: Ref
) => {
  const internalRegistry = registry as ReactivityRegistryInternal;
  return internalRegistry._memoizedDeps.get(ref) ?? null;
};

export const forkRegistry = (
  registry: ReactivityRegistryMain
): ReactivityRegistryBranch => {
  const internalRegistry = registry as ReactivityRegistryMainInternal;
  const branch: ReactivityRegistryBranchInternal = {
    _stateDict: createOverlayMap(internalRegistry._stateDict),
    _cache: createOverlayMap(internalRegistry._cache),
    _tasks: createOrderedSet(),
    _deps: createOverlayMap(internalRegistry._deps),
    _memoizedDeps: createOverlayMap(internalRegistry._memoizedDeps),
    _effects: createOverlayMap(internalRegistry._effects),
    _effectsActive: new Map(),
    _dirty: new WeakSet(),
  };

  internalRegistry._branches.add(branch);
  return branch;
};
