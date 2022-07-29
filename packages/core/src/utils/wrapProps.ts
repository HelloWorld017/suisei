import { isRef } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { PropsBase, Propize, PropsValidatedWithoutChildren } from '../types';

export const wrapProps = <P extends PropsBase>(
	props: Propize<P>, primitives: Primitives
): PropsValidatedWithoutChildren<P> => {
	type WrappedProps = PropsValidatedWithoutChildren<P>;
	return Object
		.keys(props)
		.reduce<Partial<WrappedProps>>((wrappedProps, propKey) => {
			const propValue = props[propKey as keyof WrappedProps];
			wrappedProps[propKey as keyof WrappedProps] =
				(isRef(propValue) ? propValue : primitives.constant(propValue)) as WrappedProps[keyof WrappedProps];

			return wrappedProps;
		}, {}) as WrappedProps;
};
