import type { Pipeline, PipelineManager } from './PipelineManager';
import type { Ref } from './Ref';
import type { Task } from '@suisei/core';
import type { OverlayMap, SymbolReactivityNoValue } from '@suisei/shared';

export type ReactivityRegistry = {
  read<T>(ref: Ref<T>): T | typeof SymbolReactivityNoValue;
  writeState<T>(ref: Ref<T>, value: T): void;
  writeCache<T>(ref: Ref<T>, value: T): void;
};

export type ReactivityRegistryInternal =
  | ReactivityRegistryMainInternal
  | ReactivityRegistryBranchInternal;

export type ReactivityRegistryMain = ReactivityRegistry & {
  fork(pipelineManager?: PipelineManager): ReactivityRegistryBranch;
};

export type ReactivityRegistryMainInternal = ReactivityRegistryMain & {
  _stateDict: WeakMap<Ref, unknown>;
  _cache: WeakMap<Ref, unknown>;
  _deps: WeakMap<Ref, Map<Task, Pipeline>>;
  _pipelineManager: PipelineManager;
  _branches: ReactivityRegistryBranchInternal[];
};

export type ReactivityRegistryBranch = ReactivityRegistry & {
  commit(): void;
  dispose(): void;
};

export type ReactivityRegistryBranchInternal = ReactivityRegistryBranch & {
  _stateDict: OverlayMap<Ref, unknown>;
  _cache: OverlayMap<Ref, unknown>;
  _deps: OverlayMap<Ref, Map<Task, Pipeline>>;
  _pipelineManager: PipelineManager;
  _dirty: WeakSet<Ref>;
};
