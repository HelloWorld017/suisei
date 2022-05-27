import { backend } from './backend';
import { createRef } from '@suisei/reactivity';
import { isRef } from '@suisei/shared';
import type { Component, Node, Ref } from './types';

export const createElement = (
	componentName: string | Component,
	props: Record<string, any>,
	...children: Node & any[]
) => {
	const propsWithChildren: Record<string, any> = { ...props, children };
	const wrappedProps = Object
		.keys(propsWithChildren)
		.reduce<Record<string, Ref<any>>>((wrappedProps, propKey) => {
			const propValue = propsWithChildren[propKey];
			wrappedProps[propKey] = isRef(propValue) ? propValue : createRef(propValue);
			
			return wrappedProps;
		}, {});
	
	if (typeof componentName === 'string') {
		return backend.createIntrinsicElement(componentName, wrappedProps);
	} else {
		return backend.createComponentElement(componentName, wrappedProps);
	}
};
