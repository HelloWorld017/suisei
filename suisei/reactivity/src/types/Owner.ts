import type { Effect, EffectRunAt } from './Effect';
import type { Ref } from './Ref';

export const UpdateFlags = {
  IS_DEFERRED: 1,
};

export type Owner = {
  stateCount: number;
  onStateUpdate(ref: Ref, flags: number, runUpdate: () => void): void;
  onDeriveUpdateByObserve(ref: Ref, flags: number, runDerive: () => void): void;
  onEffectInitialize(runAt: EffectRunAt, runEffect: Effect): void;
  onEffectUpdate(runAt: EffectRunAt, runUpdate: () => void): void;

  onFutureInitialize(
    futureSymbol: symbol,
    promise: Promise<unknown>,
    cleanup: () => void
  ): void;

  onFutureUpdate(
    futureSymbol: symbol,
    promise: Promise<unknown>,
    flags: number
  ): void;

  onError(error: unknown): void;
};
