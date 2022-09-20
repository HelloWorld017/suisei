import { SuspenseContext } from '../contexts';
import { createProviderElement } from '../createElement';
import type { Children, Element } from '../types';

type SuspenseProps = { fallback: Element; children: Children };
export const Suspense = ({ fallback, children }: SuspenseProps): Element =>
  createProviderElement({ [SuspenseContext.key]: { fallback } }, {}, children);
