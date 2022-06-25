import type { PropBase } from './Component';
import type { Ref } from './Ref';
import type { SymbolComponentElement, SymbolIntrinsicElement, SymbolIs } from '@suisei/shared';

export type IntrinsicElement = {
	[SymbolIs]: typeof SymbolIntrinsicElement,
	name: string,
	attributes: PropBase,
	children: Node[]
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
