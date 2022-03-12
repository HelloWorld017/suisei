import { assertsIsRef } from '@suisei/shared';
import type { ExtractRefOrRefs, Ref, RefOrRefs } from '../types';

export const useOnce = <R extends RefOrRefs>(refOrRefs: R): ExtractRefOrRefs<R> => {
	if (Array.isArray(refOrRefs)) {
		return (refOrRefs as Ref<any>[]).map(ref => {
			assertsIsRef<unknown>(ref);
			return ref.raw;
		}) as ExtractRefOrRefs<R>;
	}

	assertsIsRef(refOrRefs);
	return refOrRefs.raw;
};
