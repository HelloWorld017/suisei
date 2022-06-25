import type { Provider } from '@suisei/core';

const providers = new WeakMap<Provider<unknown>, unknown>();

export const runWithProvider = <T, R>(provider: Provider<T>, value: T, fn: () => R): R => {
	const previousHasValue = providers.has(provider);
	const previousValue = providers.get(provider);
	providers.set(provider, value);

	const output = fn();

	if (previousHasValue) {
		providers.set(provider, previousValue);
	}

	return output;
};

export const consumeProvidedValue = <T>(provider: Provider<T>): T => {
	if (!providers.has(provider)) {
		return provider.defaultValue;
	}

	return providers.get(provider) as T;
};
