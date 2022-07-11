import type { Context } from '@suisei/core';

const contexts = new WeakMap<Context<unknown>, unknown>();

export const runWithContext = <T, R>(context: Context<T>, value: T, fn: () => R): R => {
	const previousHasValue = contexts.has(context);
	const previousValue = contexts.get(context);
	contexts.set(context, value);

	const output = fn();

	if (previousHasValue) {
		contexts.set(context, previousValue);
	} else {
		contexts.delete(context);
	}

	return output;
};

export const consumeContext = <T>(context: Context<T>): T => {
	if (!contexts.has(context)) {
		return context.defaultValue;
	}

	return contexts.get(context) as T;
};
