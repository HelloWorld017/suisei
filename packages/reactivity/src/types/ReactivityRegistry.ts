import type { DependencyMap, OverlayDependencyMap } from './DependencyMap';
import type { Pipeline } from './Pipeline';
import type { Ref } from './Ref';
import type { OrderedSet, OverlayMap, OverlaySet } from '@suisei/shared';

export type EffectTask = () => void & { __kind?: 'EffectTask' };
export type DisposeTask = () => void & { __kind?: 'DisposeTask' };
export type BindTarget = EffectTask | Ref;

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
  _tasks: OrderedSet<BindTarget, Pipeline>;
  _deps: DependencyMap;
  _branches: Set<ReactivityRegistryBranchInternal>;
  _pending: WeakSet<BindTarget>;
};

export type ReactivityRegistryBranch = {
  __kind?: 'ReactivityRegistryBranch';
};

export type ReactivityRegistryBranchInternal = ReactivityRegistryBranch & {
  _stateDict: OverlayMap<Ref, unknown>;
  _cache: OverlayMap<Ref, unknown>;
  _tasks: OrderedSet<BindTarget, Pipeline>;
  _deps: OverlayDependencyMap;
  _pending: OverlaySet<BindTarget>;
  _dirty: WeakSet<Ref>;
};
