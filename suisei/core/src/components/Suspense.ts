import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Children, Element, Primitives, WrapProps } from '../types';

type SuspenseProps = WrapProps<{ fallback: Element; children: Children }>;
export const Suspense = (
  { fallback, children }: SuspenseProps,
  $: Primitives
): Element =>
  createFragmentElement(
    { [SuspenseContext.key]: $(_ => ({ fallback: _(fallback) })) },
    { raw: false, children }
  );
