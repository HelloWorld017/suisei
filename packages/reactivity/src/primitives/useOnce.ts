import { assertsIsRef } from '@suisei/shared';
import { readRef } from '../utils';
import type { ExtractRefOrRefs, RefOrRefs } from '../types';

export const useOnce: PrimitiveUseOnce = <R extends RefOrRefs>(refOrRefs: R) => {
	if (Array.isArray(refOrRefs)) {
		return refOrRefs.map(readRef) as ExtractRefOrRefs<R>;
	}

	assertsIsRef<ExtractRefOrRefs<R>>(refOrRefs);
	return readRef(refOrRefs);
};

export type PrimitiveUseOnce = <R extends RefOrRefs>(refOrRefs: R) => ExtractRefOrRefs<R>;
