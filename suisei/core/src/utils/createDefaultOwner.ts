import type { Owner } from '@suisei/reactivity';

export const createDefaultOwner = (): Owner => ({
  get stateCount() {
    return 0;
  },
  onEffectInitialize(effect) {
    effect();
  },
  onEffectUpdate(runEffect) {
    runEffect();
  },
  onError(error) {
    throw error;
  },
  onFutureInitialize() {},
  onFutureUpdate() {},
  onStateUpdate(_ref, _flags, runUpdate) {
    runUpdate();
  },
  onDeriveUpdateByObserve(_ref, _flags, runDerive) {
    runDerive();
  },
});
