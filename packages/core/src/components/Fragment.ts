import { SymbolFragmentElement, SymbolIs } from '@suisei/shared';
import type { Children, Element } from '../types';

export const Fragment = ({ children }: { children: Children }): Element => ({
	[SymbolIs]: SymbolFragmentElement,
	children
});
