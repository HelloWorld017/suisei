import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Primitives } from '../primitives';
import type { Children, Element, WrapProps } from '../types';

type SuspenseProps = WrapProps<{ fallback: Element; children: Children }>;
export const Suspense = (
  { fallback, children }: SuspenseProps,
  $: Primitives
): Element => {
  const element = createFragmentElement({}, { raw: false, children });
  const [suspenseCount, setSuspenseCount] = $.state(0);
  const [renderResult, setRenderResult] = $.state<Element>(element);

  return createFragmentElement(
    {
      [SuspenseContext.key]: $(_ => ({
        element: _(children),
        fallback: _(fallback),
        suspenseCount,
        setSuspenseCount,
        setRenderResult,
      })),
    },
    { raw: false, children: $(_ => [_(renderResult)]) }
  );
};
