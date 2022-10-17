import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { UnwrapProps } from '../types';

export const unwrapProps = <P extends object>(
  props: P,
  primitives: Primitives
): UnwrapProps<P> =>
  Object.keys(props).reduce<Partial<UnwrapProps<P>>>(
    (unwrappedProps, propKey) => {
      type Key = keyof P;
      type Value = UnwrapProps<P>[Key];

      const propValue = props[propKey as Key];
      unwrappedProps[propKey as Key] = isRef(propValue)
        ? (primitives.useOnce(propValue) as Value)
        : (propValue as Value);

      return unwrappedProps;
    },
    {}
  ) as UnwrapProps<P>;
