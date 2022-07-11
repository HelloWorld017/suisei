import type {
	Equals,
	SymbolComponentElement,
	SymbolFragmentElement,
	SymbolIntrinsicElement,
	SymbolIs
} from '@suisei/shared';
import type { PropBase } from './Component';
import type { Ref } from './Ref';

export type ComponentElement = {
	[SymbolIs]: typeof SymbolComponentElement,
	componentId: string,
};

export type AsyncComponentElement = Promise<ComponentElement>;

export type FragmentElement = {
	[SymbolIs]: typeof SymbolFragmentElement,
	children: NodeChildren
};

export type IntrinsicElement = {
	[SymbolIs]: typeof SymbolIntrinsicElement,
	name: string,
	attributes: PropBase,
	children: NodeChildren
};

export type Element = ComponentElement | AsyncComponentElement | FragmentElement | IntrinsicElement;
export type SuiseiElement = Element;

type NodeValuePrimitive = Element | string | number | null;
type NodeValueList = NodeValuePrimitive | NodeValuePrimitive[];
type NodeValue = NodeValueList | Ref<NodeValueList>;
type NodeChildren = NodeValue[];

export type Node = NodeValue | NodeChildren;
export type SuiseiNode = Node;

type ChildrenImpl<T extends Node[], N extends number> =
	T['length'] extends N
		? T
		: ChildrenImpl<[...T, NodeValue], N>;

export type Children<T extends number = number> =
	Equals<T, number> extends true
		? NodeValue[]
		: ChildrenImpl<[], T>;
