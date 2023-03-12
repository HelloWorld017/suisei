import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Primitives } from '../primitives';
import type { Children, Element, WrapProps } from '../types';

type SuspenseProps = WrapProps<{ fallback: Element; children: Children }>;
export const Suspense = (
  { fallback, children }: SuspenseProps,
  $: Primitives
): Element => {
  const element = createFragmentElement(
    { [SuspenseContext.key]: $(_ => ({ fallback: _(fallback), element })) },
    { raw: false, children }
  );

  return element;
};
