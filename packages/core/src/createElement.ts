import { backend } from './backend';
import { constant } from '@suisei/reactivity';
import type { Children, Component, Propize, PropBase, Ref, PropValidated } from './types';

export const createElement = <P extends PropBase = PropBase>(
	componentName: string | Component<P>,
	props: Omit<Propize<PropValidated<P>>, 'children'>,
	...children: Children
) => {
	const wrappedProps = Object
		.keys(props)
		.reduce<Partial<PropValidated<P>>>((wrappedProps, propKey) => {
			const propValue = props[propKey as keyof typeof props];
			if (!propKey.startsWith('$')) {
				wrappedProps[propKey as Exclude<keyof PropValidated<P>, 'children'>] =
					constant(propValue) as Ref<any> as PropValidated<P>[Exclude<keyof PropValidated<P>, 'children'>];
			} else {
				wrappedProps[propKey as keyof PropValidated<P>] = propValue;
			}

			return wrappedProps;
		}, {}) as PropValidated<P>;

	wrappedProps.children = children.flat();

	if (typeof componentName === 'string') {
		return backend.createIntrinsicElement(componentName, wrappedProps);
	} else {
		return backend.createComponentElement(componentName, wrappedProps);
	}
};
