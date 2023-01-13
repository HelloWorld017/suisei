import type { Owner, Scheduler } from 'suisei/unsafe-internals';

export const createOwner = (scheduler: Scheduler): Owner => ({
  stateCount: 0,
  scheduler,
  onStateUpdate(ref, flags) {
    // TODO
  },
  onComputeDerive(compute) {
    // TODO
  },
  onEffectInitialize(effect) {
    // TODO
  },
  onEffectSyncInitialize(effect) {
    // TODO
  },
  onFutureRefetchInitialize(promise, flags) {
    // TODO
  },
  onFutureRefetchFinish(promise) {
    // TODO
  },
  onError(error) {
    // TODO
  },
});
