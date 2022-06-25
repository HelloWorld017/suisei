import { backend } from './backend';
import { constant } from '@suisei/reactivity';
import { Component, Node, Propize, PropBase } from './types';

export const createElement = <P extends PropBase = PropBase>(
	componentName: string | Component<P>,
	props: Propize<P>,
	...children: Node & any[]
) => {
	const propsWithChildren: P = { ...props, children };
	const wrappedProps = Object
		.keys(propsWithChildren)
		.reduce<Partial<P>>((wrappedProps, propKey: keyof P & string | `${keyof P & string}`) => {
			const propValue = propsWithChildren[propKey];
			if (propKey.startsWith('$')) {
				wrappedProps[propKey.slice(1) as keyof P] = constant(propValue) as P[keyof P];
			} else {
				wrappedProps[propKey as keyof P] = propValue as P[keyof P];
			}

			return wrappedProps;
		}, {}) as P;

	if (typeof componentName === 'string') {
		return backend.createIntrinsicElement(componentName, wrappedProps);
	} else {
		return backend.createComponentElement(componentName, wrappedProps);
	}
};
