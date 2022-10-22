import { createFragmentElement } from '../createElement';
import type { Children, Element, WrapProps } from '../types';

type FragmentProps = WrapProps<{ children: Children }>;
export const Fragment = ({ children }: FragmentProps): Element =>
  createFragmentElement(null, { raw: false, children });
