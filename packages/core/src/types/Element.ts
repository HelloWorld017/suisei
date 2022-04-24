import type { SymbolComponentElement, SymbolIntrinsicElement } from '@suisei/shared';

export type IntrinsicElement = {
	is: typeof SymbolIntrinsicElement,
	name: string,
	attributes: Record<string, unknown>,
	children: Element[]
};

export type ComponentElement = {
	is: typeof SymbolComponentElement,
	componentId: string,
};

export type Element = IntrinsicElement | ComponentElement;
export type SuiseiElement = Element;

export type Node = Element | string | null | Node[];
export type SuiseiNode = Node;
