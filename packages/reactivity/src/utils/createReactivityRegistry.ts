import {
  createOverlayMap,
  REF_KIND_STATE,
  SymbolRefDescriptor,
  SymbolReactivityNoValue,
  createOrderedSet,
  createOverlaySet,
} from '@suisei/shared';
import type { Pipeline } from '../types/Pipeline';
import type {
  EffectTask,
  DisposeTask,
  ReactivityRegistryBranch,
  ReactivityRegistryBranchInternal,
  ReactivityRegistryInternal,
  ReactivityRegistryMainInternal,
} from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';

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
  registry._deps.get(ref)?.forEach(ref => registry._depsTasks.add(ref));
  registry._effects
    .get(ref)
    ?.forEach((pipeline, effect) =>
      registry._effectsTasks.insert(pipeline, effect)
    );

  if ('_branches' in registry) {
    registry._branches.forEach(branch => {
      if (branch._dirty.has(ref)) {
        notifyUpdate(branch, ref);
      }
    });
  }
};

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

const openDeps = (registry: ReactivityRegistryInternal, ref: Ref) => {
  const deps = registry._deps.get(ref);
  if (deps) {
    return createOverlaySet(deps);
  }

  const newDeps = new Set<Ref>();
  registry._deps.set(ref, newDeps);
  return createOverlaySet(newDeps);
};

export const createReactivityRegistry = () => {
  const stateDict = new WeakMap<Ref, unknown>();
  const cache = new WeakMap<Ref, unknown>();
  const deps = new WeakMap<Ref, Set<Ref>>();
  const depsTasks = new Set<Ref>();
  const effects = new WeakMap<Ref, Map<EffectTask, Pipeline>>();
  const effectsTasks = createOrderedSet<EffectTask, Pipeline>();
  const branches = new Set<ReactivityRegistryBranchInternal>();

  const fork = (): ReactivityRegistryBranch => {
    const branch: ReactivityRegistryBranchInternal = {
      _stateDict: createOverlayMap(stateDict),
      _cache: createOverlayMap(cache),
      _deps: createOverlayMap(deps),
      _depsTasks: new Set(),
      _effects: createOverlayMap(effects),
      _effectsActive: new Map(),
      _effectsTasks: createOrderedSet(),
      _dirty: new WeakSet(),
      read: ref => readRef(branch, ref),
      writeState: (ref, value) => {
        branch._stateDict.set(ref, value);
        notifyUpdate(branch, ref);
      },
      writeCache: (ref, value) => {
        branch._cache.set(ref, value);
        notifyUpdate(branch, ref);
      },
      addEffect: (ref, effectTask, disposeTask, pipeline) =>
        addEffect(branch, ref, effectTask, disposeTask, pipeline),
      removeEffect: (ref, effectTask) => removeEffect(branch, ref, effectTask),
      openDeps: ref => openDeps(branch, ref),
    };

    return branch;
  };

  const registry: ReactivityRegistryMainInternal = {
    _stateDict: stateDict,
    _cache: cache,
    _deps: deps,
    _depsTasks: depsTasks,
    _effects: effects,
    _effectsTasks: effectsTasks,
    _branches: branches,
    read: ref => readRef(registry, ref),
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
    openDeps: ref => openDeps(registry, ref),
    fork,
  };

  return registry;
};
