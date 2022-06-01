import type { SymbolComponentElement, SymbolIntrinsicElement, SymbolIs } from '@suisei/shared';
import type { Ref } from '@suisei/reactivity';

export type IntrinsicElement = {
	[SymbolIs]: typeof SymbolIntrinsicElement,
	name: string,
	attributes: Record<string, unknown>,
	children: Element[]
};

export type ComponentElement = {
	[SymbolIs]: typeof SymbolComponentElement,
	componentId: string,
};

export type Element = IntrinsicElement | ComponentElement;
export type SuiseiElement = Element;

type NodeValue = Element | string | null;
type NodeValueOrRef = NodeValue | Ref<NodeValue>;
export type Node = NodeValueOrRef | NodeValueOrRef[];
export type SuiseiNode = Node;
