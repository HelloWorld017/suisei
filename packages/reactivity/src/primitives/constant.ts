import { owner } from '../owner';
import { SymbolIs, SymbolRef } from '@suisei/shared';
import type { ConstantRef } from '../types';

export const constant = <T>(constantValue: T): ConstantRef<T> => ({
	[SymbolIs]: SymbolRef,
	id: owner.stateCount++,
	isConstant: true,
	raw: constantValue,
	from: owner,
});
