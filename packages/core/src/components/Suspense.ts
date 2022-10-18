import { SuspenseContext } from '../contexts';
import { createFragmentElement } from '../createElement';
import type { Children, Element, WrapProps } from '../types';

type SuspenseProps = WrapProps<{ fallback: Element; children: Children }>;
export const Suspense = ({ fallback, children }: SuspenseProps): Element =>
  createFragmentElement(
    { [SuspenseContext.key]: { fallback } },
    { raw: false, children }
  );
