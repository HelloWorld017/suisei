import { isConstantOrVariableRef, isFutureRef } from '@suisei/shared';
import { Ref } from '../types';

export const readRef = <T>(ref: Ref<T>, selectedRefs: Set<Ref<T>>) => {
	if (isConstantOrVariableRef(ref)) {
		return ref.raw;
	}
	
	if (isFutureRef(ref)) {
		throw new SuspendDerivation();
	}
}
