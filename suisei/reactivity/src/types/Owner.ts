import type { Effect } from './Effect';
import type { Ref } from './Ref';

export const UpdateFlags = {
  IS_DEFERRED: 1,
};

export type Owner = {
  stateCount: number;
  onStateUpdate(ref: Ref, flags: number, runUpdate: () => void): void;
  onDeriveUpdateByObserve(ref: Ref, flags: number, runDerive: () => void): void;
  onEffectInitialize(effect: Effect, runAt?: 'sync'): void;
  onEffectUpdate(runEffect: () => void): void;
  onFutureInitialize(promise: Promise<unknown>, cleanup: () => void): void;
  onFutureUpdate(promise: Promise<unknown>, flags: number): void;
  onError(error: unknown): void;
};
