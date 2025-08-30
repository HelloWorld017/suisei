import type { DependencyMap, OverlayDependencyMap } from './DependencyMap';
import type { EffectTask } from './Effect';
import type { Pipeline } from './Pipeline';
import type { Ref } from './Ref';
import type { OrderedSet, OverlayMap, OverlaySet } from '@suisei/shared';

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
  stateDict: WeakMap<Ref, unknown>;
  cache: WeakMap<Ref, unknown>;
  tasks: OrderedSet<BindTarget, Pipeline>;
  deps: DependencyMap<Ref, EffectTask, Pipeline>;
  branches: Set<ReactivityRegistryBranchInternal>;
  pending: WeakSet<BindTarget>;
};

export type ReactivityRegistryBranch = {
  __kind?: 'ReactivityRegistryBranch';
};

export type ReactivityRegistryBranchInternal = ReactivityRegistryBranch & {
  stateDict: OverlayMap<Ref, unknown>;
  cache: OverlayMap<Ref, unknown>;
  tasks: OrderedSet<BindTarget, Pipeline>;
  deps: OverlayDependencyMap<Ref, EffectTask, Pipeline>;
  pending: OverlaySet<BindTarget>;
  dirty: WeakSet<Ref>;
};
