import { createFragmentElement } from '../createElement';
import type { Children, Element } from '../types';

export const Fragment = ({ children }: { children: Children }): Element =>
  createFragmentElement(null, { children });
