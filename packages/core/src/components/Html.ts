import { createFragmentElement } from '../createElement';
import type { Children, Element } from '../types';

type HtmlProps = { markup: string; children: Children<0> };
export const Html = ({ markup }: HtmlProps): Element =>
  createFragmentElement(null, { children: [markup], raw: true });
