import type { Backend } from './types';

export let backend: Backend;
export const runWithBackend = <T>(newBackend: Backend, fn: () => T): T => {
	const oldBackend = backend;
	backend = newBackend;
	
	const result = fn();
	backend = oldBackend;
	
	return result;
};
