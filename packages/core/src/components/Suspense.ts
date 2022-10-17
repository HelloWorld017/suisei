import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Children, Element } from '../types';

type SuspenseProps = { fallback: Element; children: Children };
export const Suspense = ({ fallback, children }: SuspenseProps): Element =>
  createFragmentElement({ [SuspenseContext.key]: { fallback } }, { children });
