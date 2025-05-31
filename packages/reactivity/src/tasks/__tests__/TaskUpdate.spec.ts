import { createDefaultScheduler, MIN_SCHEDULER_PRIORITY } from '@suisei/core';
import {
  KIND_REF,
  REF_KIND_DERIVED,
  REF_KIND_STATE,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { PIPELINE_RENDER } from '../../constants';
import {
  createReactivityRegistry,
  writeStateToRegistry,
} from '../../utils/createReactivityRegistry';
import { readRef } from '../../utils/readRef';
import { TaskUpdate } from '../TaskUpdate';
import type { ReactivityRegistry } from '../../types/ReactivityRegistry';
import type {
  DerivedRefInternal,
  Ref,
  RefSelector,
  StateRefInternal,
} from '../../types/Ref';

const createStateRef = <T>(
  registry: ReactivityRegistry,
  initialValue: T
): Ref<T> => {
  const ref: StateRefInternal<T> = {
    [SymbolIs]: KIND_REF,
    [SymbolRefDescriptor]: {
      kind: REF_KIND_STATE,
      isReadwrite: true,
    },
  };

  writeStateToRegistry(registry, ref, initialValue);
  return ref;
};

const createDerivedRef = <T>(
  derive: (ref: RefSelector) => T,
  isMemoized = true
): Ref<T> => {
  const ref: DerivedRefInternal<T> = {
    [SymbolIs]: KIND_REF,
    [SymbolRefDescriptor]: {
      kind: REF_KIND_DERIVED,
      isReadwrite: false,
      derive,
      isMemoized,
    },
  };

  return ref;
};

it('should propagate update', () => {
  const scheduler = createDefaultScheduler({
    limit: 0,
    requestNextTick: callback => callback(),
    requestNextRenderTick: callback => callback(),
  });

  const registry = createReactivityRegistry();
  const stateA = createStateRef(registry, 10);
  const stateB = createStateRef(registry, 30);
  const derivedA = createDerivedRef(_ => _(stateA) + _(stateB) * 2, false);
  const derivedB = createDerivedRef(_ => _(derivedA) * 10 + _(stateB));
  const derivedC = createDerivedRef(_ => _(derivedA) + _(derivedB));

  scheduler.queueTask(
    MIN_SCHEDULER_PRIORITY,
    TaskUpdate(registry, PIPELINE_RENDER)
  );

  expect(readRef(registry, derivedC)).toBe(800);

  writeStateToRegistry(registry, stateB, 10);
  scheduler.queueTask(
    MIN_SCHEDULER_PRIORITY,
    TaskUpdate(registry, PIPELINE_RENDER)
  );

  expect(readRef(registry, derivedC)).toBe(340);
});
