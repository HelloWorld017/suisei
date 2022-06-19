import { owner } from '../owner';
import { SymbolIs, SymbolRef, SymbolRefDescriptor } from '@suisei/shared';
import type { ConstantRef } from '../types';

export const constant = <T>(constantValue: T): ConstantRef<T> => ({
	[SymbolIs]: SymbolRef,
	[SymbolRefDescriptor]: {
		id: owner.stateCount++,
		isConstant: true,
		raw: constantValue,
		from: owner
	}
});
