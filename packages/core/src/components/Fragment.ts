import { createProviderElement } from '../createElement';
import type { Children, Element } from '../types';

export const Fragment = ({ key, children }: { key: string, children: Children }): Element =>
	createProviderElement(null, { key }, children);
