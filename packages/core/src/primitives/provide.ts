import { createElement } from '../createElement';
import { runWithContext } from '../contexts';
import { Fragment } from '../components';
import type { Context, Provider } from '../types';

export const provide = <T>(defaultValue: T): [ Context<T>, Provider<T> ] => {
	const GeneratedContext = { defaultValue };
	const GeneratedContextProvider: Provider<T> = ({ value, children }) => {
		return runWithContext(GeneratedContext, value, () => {
			return createElement(Fragment, {}, ...children);
		});
	};

	return [ GeneratedContext, GeneratedContextProvider ];
}
