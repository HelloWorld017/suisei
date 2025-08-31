import type { Owner } from '../types/Owner';

let owners: Owner[] = [];

export const withOwner = (owner: Owner, fn: () => void) => {
  owners.push(owner);
  fn();
  owners.pop();
};

export const getCurrentOwner = () => owners.at(-1);
