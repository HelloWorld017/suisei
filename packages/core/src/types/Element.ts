import type { PropBase } from './Component';
import type { Ref } from './Ref';
import type { SymbolComponentElement, SymbolFragmentElement, SymbolIntrinsicElement, SymbolIs } from '@suisei/shared';

export type ComponentElement = {
	[SymbolIs]: typeof SymbolComponentElement,
	componentId: string,
};

export type FragmentElement = {
	[SymbolIs]: typeof SymbolFragmentElement,
	children: Node[]
};

export type IntrinsicElement = {
	[SymbolIs]: typeof SymbolIntrinsicElement,
	name: string,
	attributes: PropBase,
	children: Node[]
};

export type Element = ComponentElement | FragmentElement | IntrinsicElement;
export type SuiseiElement = Element;

type NodeValue = Element | string | null;
type NodeValueWithRef = NodeValue | Ref<NodeValue>;
type NodeValueWithPromise = NodeValueWithRef | Promise<NodeValueWithRef>;
export type Node = NodeValueWithPromise | NodeValueWithPromise[];
export type RefNode<T extends Node[]> = T & Ref<any>;
export type SuiseiNode = Node;
export type SuiseiRefNode<T extends Node[]> = RefNode<T>;
