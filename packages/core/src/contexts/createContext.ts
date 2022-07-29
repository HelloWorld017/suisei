import { createProviderElement } from '../createElement';
import type { Context, Provider } from '../types';

export const createContext = <T>(defaultValue: T, name?: string): [ Context<T>, Provider<T> ] => {
	const GeneratedContext = { key: Symbol(), name, defaultValue } as Context<T>;
	const GeneratedContextProvider: Provider<T> = ({ value, children }) =>
		createProviderElement(value, children);

	return [ GeneratedContext, GeneratedContextProvider ];
};
