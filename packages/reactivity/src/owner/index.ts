import type { Owner } from '../types';

export let owner: Owner;

export const runWithOwner = <T>(newOwner: Owner, fn: () => T): T => {
	const previousOwner = owner;
	owner = newOwner;

	const retVal = fn();
	owner = previousOwner;

	return retVal;
};
