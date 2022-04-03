import { renderer } from './renderer';
import type { Component, Element } from '@suisei/core';
import type { Owner } from '@suisei/reactivity';

export const createElement = <P extends Record<string, any>>(
	component: Component<P>,
	props: Omit<P, 'children'>,
	...children: Pick<P, 'children'> extends { children: Array<Element> } ? Pick<P, 'children'>['children'] : []
): Element => {
	if (!renderer.componentMap.has(component)) {
		renderer.emit()
		renderer.componentMap.set
	}
	
	const elementOwner: Owner = {
		key: 0
	};
};
