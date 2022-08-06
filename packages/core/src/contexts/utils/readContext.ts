import type { Context, ContextRegistry } from '../../types';

export const readContext = <T>(contextRegistry: ContextRegistry, context: Context<T>): T => {
	if (context.key in contextRegistry) {
		return (contextRegistry as { [K in typeof context.key]: T })[context.key];
	}

	return context.defaultValue;
};
