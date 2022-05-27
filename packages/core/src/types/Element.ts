import type { SymbolComponentElement, SymbolIntrinsicElement } from '@suisei/shared';
import type { Ref } from '@suisei/reactivity';

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

type NodeValue = Element | string | null;
type NodeValueOrRef = NodeValue | Ref<NodeValue>;
export type Node = NodeValueOrRef | NodeValueOrRef[];
export type SuiseiNode = Node;
