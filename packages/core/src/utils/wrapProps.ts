import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type {
  PropsBase,
  Propize,
  PropsValidatedWithoutChildren,
  Ref,
} from '../types';

export const wrapProps = <P extends PropsBase>(
  props: Propize<P>,
  primitives: Primitives
): PropsValidatedWithoutChildren<P> => {
  type WrappedProps = PropsValidatedWithoutChildren<P>;
  return Object.keys(props).reduce<Partial<WrappedProps>>(
    (wrappedProps, propKey) => {
      const propValue = props[propKey as keyof Propize<P>];

      wrappedProps[propKey as keyof WrappedProps] = (
        isRef(propValue as Ref<unknown>)
          ? propValue
          : primitives.constant(propValue)
      ) as WrappedProps[keyof WrappedProps];

      return wrappedProps;
    },
    {}
  ) as WrappedProps;
};
