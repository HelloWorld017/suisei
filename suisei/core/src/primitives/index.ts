import { createReactivityPrimitives } from '@suisei/reactivity';
import { createDefaultOwner } from '../utils/createDefaultOwner';
import { consume } from './consume';
import type { ContextRegistry } from '../types';
import type { PrimitiveConsume } from './consume';
import type { Owner, ReactivityPrimitives } from '@suisei/reactivity';

export type Primitives = ReactivityPrimitives & {
  consume: PrimitiveConsume;
};

export const createPrimitives = (
  contextRegistry: ContextRegistry,
  owner: Owner
): Primitives => {
  const primitives = createReactivityPrimitives(owner) as Primitives;
  primitives.consume = consume(contextRegistry);

  return primitives;
};

export const globalPrimitives = createPrimitives(
  Object.create(null) as ContextRegistry,
  createDefaultOwner()
);
