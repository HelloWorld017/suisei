import type { Component } from './Component';
import type { Ref } from './Ref';
import type { Equals, SymbolElement, SymbolIs } from '@suisei/shared';

export type Element = {
  [SymbolIs]: typeof SymbolElement;
  key?: Ref<string | undefined>;
  component: string | Component | null;
  props: Record<string, unknown>;
  provide: Record<symbol, unknown> | null;
};

export type { Element as SuiseiElement };

type NodeValuePrimitive = Element | string | number | null;
type NodeValueList = NodeValuePrimitive | NodeValuePrimitive[];
type NodeValue = NodeValueList | Ref<NodeValueList>;
type NodeChildren = NodeValue[];
type Node = NodeValue | NodeChildren;

export type {
  Node,
  NodeChildren,
  NodeValue,
  NodeValueList,
  NodeValuePrimitive,
};
export type { Node as SuiseiNode };

type ChildrenImpl<T extends Node[], N extends number> = T['length'] extends N
  ? T
  : ChildrenImpl<[...T, NodeValue], N>;

export type Children<T extends number = number> = Equals<T, number> extends true
  ? NodeValue[]
  : ChildrenImpl<[], T>;

export type { Children as SuiseiChildren };
