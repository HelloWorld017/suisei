import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { PropBase, Propize, PropValidatedWithoutChildren } from '../types';

export const wrapProps = <P extends PropBase>(
	props: Propize<P>, primitives: Primitives
): PropValidatedWithoutChildren<P> => {
	type WrappedProps = PropValidatedWithoutChildren<P>;
	return Object
		.keys(props)
		.reduce<Partial<WrappedProps>>((wrappedProps, propKey) => {
			const propValue = props[propKey as keyof WrappedProps];
			wrappedProps[propKey as keyof WrappedProps] =
				(isRef(propValue) ? propValue : primitives.constant(propValue)) as WrappedProps[keyof WrappedProps];

			return wrappedProps;
		}, {}) as WrappedProps;
};
