import { constant } from './constant';
import { decompose } from './decompose';
import { derive } from './derive';
import { effect, effectSync } from './effect';
import { future } from './future';
import { state } from './state';
import { useOnce } from './useOnce';
import type { Owner } from '../types';
import type { PrimitiveConstant } from './constant';
import type { PrimitiveDecompose } from './decompose';
import type { PrimitiveDerive } from './derive';
import type { PrimitiveEffect, PrimitiveEffectSync } from './effect';
import type { PrimitiveFuture } from './future';
import type { PrimitiveState } from './state';
import type { PrimitiveUseOnce } from './useOnce';

export type ReactivityPrimitives = PrimitiveDerive & {
  constant: PrimitiveConstant;
  decompose: PrimitiveDecompose;
  derive: PrimitiveDerive;
  effect: PrimitiveEffect;
  effectSync: PrimitiveEffectSync;
  future: PrimitiveFuture;
  state: PrimitiveState;
  useOnce: PrimitiveUseOnce;
};

export const createReactivityPrimitives = (
  owner: Owner
): ReactivityPrimitives => {
  const $ = derive;

  return Object.assign($, {
    constant: constant(owner),
    decompose,
    derive,
    effect: effect(owner),
    effectSync: effectSync(owner),
    future: future(owner),
    state: state(owner),
    useOnce: useOnce(owner),
  });
};
