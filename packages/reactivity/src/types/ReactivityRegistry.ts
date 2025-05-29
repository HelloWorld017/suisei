import type { Pipeline } from './Pipeline';
import type { Ref } from './Ref';
import type { OrderedSet, OverlayMap } from '@suisei/shared';

export type EffectTask = () => void & { __kind?: 'EffectTask' };
export type DisposeTask = () => void & { __kind?: 'DisposeTask' };

export type ReactivityRegistry =
  | ReactivityRegistryMain
  | ReactivityRegistryBranch;

export type ReactivityRegistryInternal =
  | ReactivityRegistryMainInternal
  | ReactivityRegistryBranchInternal;

export type ReactivityRegistryMain = {
  __kind?: 'ReactivityRegistryMain';
};

export type ReactivityRegistryMainInternal = ReactivityRegistryMain & {
  _stateDict: WeakMap<Ref, unknown>;
  _cache: WeakMap<Ref, unknown>;
  _tasks: OrderedSet<EffectTask | Ref, Pipeline>;
  _deps: WeakMap<Ref, Set<Ref>>;
  _memoizedDeps: WeakMap<Ref, Map<Ref, unknown>>;
  _effects: WeakMap<Ref, Map<EffectTask, Pipeline>>;
  _branches: Set<ReactivityRegistryBranchInternal>;
};

export type ReactivityRegistryBranch = {
  __kind?: 'ReactivityRegistryBranch';
};

export type ReactivityRegistryBranchInternal = ReactivityRegistryBranch & {
  _stateDict: OverlayMap<Ref, unknown>;
  _cache: OverlayMap<Ref, unknown>;
  _tasks: OrderedSet<EffectTask | Ref, Pipeline>;
  _deps: OverlayMap<Ref, Set<Ref>>;
  _memoizedDeps: OverlayMap<Ref, Map<Ref, unknown>>;
  _effects: OverlayMap<Ref, Map<EffectTask, Pipeline>>;
  _effectsActive: Map<EffectTask, DisposeTask>;
  _dirty: WeakSet<Ref>;
};
