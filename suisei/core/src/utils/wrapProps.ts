import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { WrapProps } from '../types';

export const wrapProps = <P extends object>(
  props: P,
  primitives: Primitives
): WrapProps<P> =>
  Object.keys(props).reduce<Partial<WrapProps<P>>>((wrappedProps, propKey) => {
    type Key = keyof P;
    type Value = WrapProps<P>[Key];

    const propValue = props[propKey as Key];
    wrappedProps[propKey as Key] = isRef(propValue)
      ? (propValue as Value)
      : (primitives.constant(propValue) as Value);

    return wrappedProps;
  }, {}) as WrapProps<P>;
