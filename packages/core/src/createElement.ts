import { SymbolElement, SymbolIs } from '@suisei/shared';
import type { Children, Component, Element, PropsBase, PropsValidated, Propize } from './types';

export const createProviderElement = (
	providingValue: null | Record<symbol, unknown>,
	props: Omit<Propize<{}>, 'children'>,
	children: Children
): Element => ({
	[SymbolIs]: SymbolElement,
	component: null,
	props,
	provide: providingValue,
	children: children.flat(),
});

export const createElement = <P extends PropsBase = PropsBase>(
	component: string | Component<P>,
	props: Omit<Propize<P>, 'children'>,
	...children: PropsValidated<P>['children']
): Element => ({
	[SymbolIs]: SymbolElement,
	component,
	props,
	provide: null,
	children: children.flat(),
});
