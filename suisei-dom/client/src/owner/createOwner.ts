import type { Owner, Scheduler, Task } from 'suisei/unsafe-internals';

export const createOwner = (scheduler: Scheduler): Owner => {
  const pendingUpdates: Task[] = [];

  return {
    stateCount: 0,
    onStateUpdate(ref, flags, runUpdate) {
      pendingUpdates.push(runUpdate);
    },
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
