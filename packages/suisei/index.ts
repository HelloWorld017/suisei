import { createDefaultOwner, createPrimitives } from '@suisei/core';

export {
  createContext,
  createElement,
  Fragment,
  Html,
  Suspense,
} from '@suisei/core';

export const $$ = createPrimitives(createDefaultOwner(), Object.create(null));
