import { createProviderElement } from '../createElement';
import type { Children, Element } from '../types';

export const Fragment = ({ children }: { children: Children }): Element =>
  createProviderElement(null, {}, children);
