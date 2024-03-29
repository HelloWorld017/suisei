import { createFragmentElement } from '../createElement';
import type { Primitives } from '../primitives';
import type { Children, Element, WrapProps } from '../types';

type HtmlProps = WrapProps<{ markup: string; children: Children<0> }>;
export const Html = ({ markup }: HtmlProps, $: Primitives): Element =>
  createFragmentElement(null, { children: $(_ => [_(markup)]), raw: true });
