import type { Owner, Scheduler } from 'suisei/unsafe-internals';

export const createOwner = (scheduler: Scheduler): Owner => {
  return {
  stateCount: 0,
  scheduler,
  onStateUpdate(_ref, _flags) {},
  onComputeDerive(compute) {
    scheduler.queueTask(() => 
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
};
};
