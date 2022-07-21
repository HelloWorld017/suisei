import { backend } from './backend';
import { constant } from '@suisei/reactivity';
import { isRef } from '@suisei/shared';
import type { Component, PropBase, PropValidated, Propize, PropValidatedWithoutChildren } from './types';

export const createElement = <P extends PropBase = PropBase>(
	componentName: string | Component<P>,
	props: Omit<Propize<P>, 'children'>,
	...children: PropValidated<P>['children']
) => {
	type WrappedProps = PropValidatedWithoutChildren<P>;
	const wrappedProps = Object
		.keys(props)
		.reduce<Partial<WrappedProps>>((wrappedProps, propKey) => {
			const propValue = props[propKey as keyof WrappedProps];
			wrappedProps[propKey as keyof WrappedProps] =
				(isRef(propValue) ? propValue : constant(propValue)) as WrappedProps[keyof WrappedProps];

			return wrappedProps;
		}, {}) as PropValidated<P>;

	wrappedProps.children = children.flat();

	if (typeof componentName === 'string') {
		return backend.createIntrinsicElement(componentName, wrappedProps);
	} else {
		return backend.createComponentElement(componentName, wrappedProps);
	}
};
