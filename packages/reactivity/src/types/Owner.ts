import type { Effect } from './Effect';
import type { Ref } from './Ref';
import type { Scheduler } from '@suisei/core';

export const UpdateFlags = {
  IS_DEFERRED: 1,
};

export type Owner = {
  scheduler: Scheduler;
  stateCount: number;
  onEffectSyncInitialize(effect: Effect): void;
  onEffectInitialize(effect: Effect): void;
  onError(error: any): void;
  onFutureRefetchInitialize(promise: Promise<any>, flags?: number): void;
  onFutureRefetchFinish(promise: Promise<any>): void;
  onStateUpdate(ref: Ref<any>, flags: number): void;
};
