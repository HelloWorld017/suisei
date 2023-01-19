import type { Effect } from './Effect';
import type { Ref } from './Ref';

export const UpdateFlags = {
  IS_DEFERRED: 1,
};

export type Owner = {
  stateCount: number;
  onStateUpdate(ref: Ref, flags: number, runUpdate: () => void): void;
  onComputeDerive(runCompute: () => void, flags: number): void;
  onEffectInitialize(effect: Effect, runAt?: 'sync'): void;
  onEffectUpdate(runEffect: () => void): void;
  onError(error: unknown): void;
  onFutureUpdate(promise: Promise<unknown>, flags: number): void;
};
