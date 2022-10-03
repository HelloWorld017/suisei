import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { PropsBase, Propize } from '../types';

export const wrapProps = <P extends PropsBase>(
  props: Propize<P>,
  primitives: Primitives
): P => {
  return Object.keys(props).reduce<Partial<P>>((wrappedProps, propKey) => {
    const propValue = props[propKey as keyof Propize<P>];

    wrappedProps[propKey as keyof P] = (
      isRef(propValue) ? propValue : primitives.constant(propValue)
    ) as P[keyof P];

    return wrappedProps;
  }, {}) as P;
};
