import { SymbolFragmentElement, SymbolIs } from '@suisei/shared';
import type { Element, Ref, Node } from '../types';

export const Fragment = ({ children }: { children: Ref<Node> }): Element => ({
	[SymbolIs]: SymbolFragmentElement,
	children
});
