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
  onError(error: unknown): void;
  onFutureRefetchInitialize(promise: Promise<unknown>, flags?: number): void;
  onFutureRefetchFinish(promise: Promise<unknown>): void;
  onStateUpdate(ref: Ref, flags: number): void;
};
