import {
  ContextRegistry,
  createDefaultOwner,
  createPrimitives,
} from '@suisei/core';

export {
  createContext,
  createElement,
  Fragment,
  Html,
  Suspense,
} from '@suisei/core';

export const $$ = createPrimitives(
  Object.create(null) as ContextRegistry,
  createDefaultOwner()
);
