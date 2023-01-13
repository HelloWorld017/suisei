import type { Effect } from './Effect';
import type { Ref } from './Ref';

export const UpdateFlags = {
  IS_DEFERRED: 1,
};

export type Owner = {
  stateCount: number;
  onStateUpdate(ref: Ref, flags: number): void;
  onComputeDerive(compute: () => void): void;
  onEffectInitialize(effect: Effect, runAt?: 'sync'): void;
  onEffectUpdate(runEffect: () => void): void;
  onError(error: unknown): void;
  onFutureUpdate(promise: Promise<unknown>, flags?: number): void;
};
