import type { Owner } from '../types';

export let owner: Owner;

export const setOwner = (newOwner: Owner) => {
	owner = newOwner;
};
