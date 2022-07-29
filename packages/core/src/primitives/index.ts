import { consume } from './consume';
import { createReactivityPrimitives } from '@suisei/reactivity';
import type { ContextRegistry } from '../types';
import type { Owner, ReactivityPrimitives } from '@suisei/reactivity';
import type { PrimitiveConsume } from './consume';

export type Primitives = ReactivityPrimitives & {
	consume: PrimitiveConsume;
};

export const createPrimitives = (contextRegistry: ContextRegistry, owner: Owner): Primitives => {
	const primitives = createReactivityPrimitives(owner) as Primitives;
	primitives.consume = consume(contextRegistry);

	return primitives;
};
