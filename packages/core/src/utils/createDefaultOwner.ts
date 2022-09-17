import { createDefaultScheduler } from './createDefaultScheduler';
import type { Owner } from '@suisei/reactivity';

export const createDefaultOwner = (): Owner => ({
  scheduler: createDefaultScheduler(),
  get stateCount() {
    return 0;
  },
  set stateCount(_value) {},
  onEffectInitialize(effect) {
    effect();
  },
  onEffectSyncInitialize(effect) {
    effect();
  },
  onError(error) {
    throw error;
  },
  onFutureRefetchInitialize() {},
  onFutureRefetchFinish() {},
  onStateUpdate() {},
});
