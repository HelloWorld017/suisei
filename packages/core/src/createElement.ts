import { SymbolElement, SymbolIs } from '@suisei/shared';
import type { Children, Component, Element, PropBase, PropValidated, Propize } from './types';

export const createProviderElement = (
	providingValue: null | Record<symbol, unknown>,
	children: Children
): Element => ({
	[SymbolIs]: SymbolElement,
	component: null,
	props: {},
	provide: providingValue,
	children: children.flat(),
});

export const createElement = <P extends PropBase = PropBase>(
	component: string | Component<P>,
	props: Omit<Propize<P>, 'children'>,
	...children: PropValidated<P>['children']
): Element => ({
	[SymbolIs]: SymbolElement,
	component,
	props,
	provide: null,
	children: children.flat(),
});
