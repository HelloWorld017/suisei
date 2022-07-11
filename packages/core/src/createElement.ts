import { backend } from './backend';
import { constant } from '@suisei/reactivity';
import { Component, Propize, PropBase, Ref } from './types';

export const createElement = <P extends PropBase = PropBase>(
	componentName: string | Component<P>,
	props: Omit<Propize<P>, 'children'>,
	...children: P['children'] & any[]
) => {
	const wrappedProps = Object
		.keys(props)
		.reduce<Partial<P>>((wrappedProps, propKey) => {
			const propValue = props[propKey as keyof typeof props];
			if (propKey.startsWith('$')) {
				wrappedProps[propKey.slice(1) as keyof P] = constant(propValue) as P[keyof P];
			} else {
				wrappedProps[propKey as keyof P] = propValue as Ref<any> as P[keyof P];
			}

			return wrappedProps;
		}, {}) as P;

	wrappedProps.children = children;
	if (typeof componentName === 'string') {
		return backend.createIntrinsicElement(componentName, wrappedProps);
	} else {
		return backend.createComponentElement(componentName, wrappedProps);
	}
};
