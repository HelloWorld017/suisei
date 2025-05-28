import type { Pipeline } from './Pipeline';
import type { Ref } from './Ref';
import type {
  OrderedSet,
  OverlayMap,
  SymbolReactivityNoValue,
} from '@suisei/shared';

export type EffectTask = () => void & { __kind?: 'EffectTask' };
export type DisposeTask = () => void & { __kind?: 'DisposeTask' };

export type ReactivityRegistry = {
  read<T>(ref: Ref<T>): T | typeof SymbolReactivityNoValue;
  writeState<T>(ref: Ref<T>, value: T): void;
  writeCache<T>(ref: Ref<T>, value: T): void;
  addEffect(
    ref: Ref,
    effectTask: EffectTask,
    disposeTask: DisposeTask,
    pipeline: Pipeline
  ): void;
  removeEffect(ref: Ref, effect: EffectTask): void;
  updateDeps(ref: Ref, deps: Set<Ref>): void;
  readMemoizedDeps(ref: Ref): unknown[] | null;
};

export type ReactivityRegistryInternal =
  | ReactivityRegistryMainInternal
  | ReactivityRegistryBranchInternal;

export type ReactivityRegistryMain = ReactivityRegistry & {
  fork(): ReactivityRegistryBranch;
};

export type ReactivityRegistryMainInternal = ReactivityRegistryMain & {
  _stateDict: WeakMap<Ref, unknown>;
  _cache: WeakMap<Ref, unknown>;
  _tasks: OrderedSet<EffectTask | Ref, Pipeline>;
  _deps: WeakMap<Ref, Set<Ref>>;
  _memoizedDeps: WeakMap<Ref, unknown[]>;
  _effects: WeakMap<Ref, Map<EffectTask, Pipeline>>;
  _branches: Set<ReactivityRegistryBranchInternal>;
};

export type ReactivityRegistryBranch = ReactivityRegistry & {
  __kind?: 'ReactivityRegistryBranch';
};

export type ReactivityRegistryBranchInternal = ReactivityRegistryBranch & {
  _stateDict: OverlayMap<Ref, unknown>;
  _cache: OverlayMap<Ref, unknown>;
  _tasks: OrderedSet<EffectTask | Ref, Pipeline>;
  _deps: OverlayMap<Ref, Set<Ref>>;
  _memoizedDeps: OverlayMap<Ref, unknown[]>;
  _effects: OverlayMap<Ref, Map<EffectTask, Pipeline>>;
  _effectsActive: Map<EffectTask, DisposeTask>;
  _dirty: WeakSet<Ref>;
};
