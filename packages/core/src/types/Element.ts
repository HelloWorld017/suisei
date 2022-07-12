import type {
	Equals,
	SymbolComponentElement,
	SymbolFragmentElement,
	SymbolIntrinsicElement,
	SymbolIs
} from '@suisei/shared';
import type { Component, PropBase } from './Component';
import type { Ref } from './Ref';

export type ComponentElement = {
	[SymbolIs]: typeof SymbolComponentElement,
	component: Component,
	props: PropBase
};

export type AsyncComponentElement = Promise<ComponentElement>;

export type FragmentElement = {
	[SymbolIs]: typeof SymbolFragmentElement,
	children: NodeChildren
};

export type IntrinsicElement = {
	[SymbolIs]: typeof SymbolIntrinsicElement,
	name: string,
	props: PropBase
};

export type Element = ComponentElement | AsyncComponentElement | FragmentElement | IntrinsicElement;
export type { Element as SuiseiElement };

type NodeValuePrimitive = Element | string | number | null;
type NodeValueList = NodeValuePrimitive | NodeValuePrimitive[];
type NodeValue = NodeValueList | Ref<NodeValueList>;
type NodeChildren = NodeValue[];
type Node = NodeValue | NodeChildren;

export type { Node, NodeChildren, NodeValue };
export type { Node as SuiseiNode };

type ChildrenImpl<T extends Node[], N extends number> =
	T['length'] extends N
		? T
		: ChildrenImpl<[...T, NodeValue], N>;

export type Children<T extends number = number> =
	Equals<T, number> extends true
		? NodeValue[]
		: ChildrenImpl<[], T>;

export type { Children as SuiseiChildren };
