import type { Context, ContextRegistry } from '../types';

export const consume = (contextRegistry: ContextRegistry): PrimitiveConsume => <T>(context: Context<T>): T => {
	if (context.key in contextRegistry) {
		return contextRegistry[context.key as never] as T;
	}

	return context.defaultValue;
};

export type PrimitiveConsume = <T>(context: Context<T>) => T;
