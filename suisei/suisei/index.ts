import type { SuiseiElement } from '@suisei/core';

export {
  createContext,
  createElement,
  globalPrimitives as $$,
  Fragment,
  Html,
  Suspense,
} from '@suisei/core';

export type {
  Children,
  Component,
  Context,
  ContextProvider,
  Primitives,
  PropsBase,
  Ref,
  SuiseiElement,
  SuiseiNode,
  WrapProps,
  UnwrapProps,
} from '@suisei/core';

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace JSX {
  interface Element extends SuiseiElement {}
}
