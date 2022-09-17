import { createProviderElement } from '../createElement';
import type { Children, Element } from '../types';

export const Html = ({
  key,
  markup,
}: {
  key?: string;
  markup: string;
  children: Children<0>;
}): Element => createProviderElement(null, { key, raw: true }, [markup]);
