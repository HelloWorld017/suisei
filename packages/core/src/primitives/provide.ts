import type { Element, Node } from '@suisei/core';

export const publish = <T>(defaultValue?: T): (props: { children: Node }) => Element => {
	const SuiseiPublishedKey = Symbol('SuiseiPublishedKey');

	return ({ children }) => createElement(Fragment, children;
}
