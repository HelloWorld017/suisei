import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Primitives } from '../primitives';
import type { Children, Element, WrapProps } from '../types';

type SuspenseProps = WrapProps<{ fallback: Element; children: Children }>;
export const Suspense = (
  { fallback, children }: SuspenseProps,
  $: Primitives
): Element => {
  let alternate = () => {};
  const [element, setElement] = $.state(
    createFragmentElement(
      { [SuspenseContext.key]: $.constant({ alternate }) },
      { raw: false, children }
    )
  );

  // FIXME update alternate
  alternate = () => {
    const fallbackFragment = createFragmentElement(
      {},
      { raw: false, children: $(_ => [_(fallback)]) }
    );
    setElement(fallbackFragment);
  };

  return createFragmentElement(
    {},
    { raw: false, children: $(_ => [_(element)]) }
  );
};
