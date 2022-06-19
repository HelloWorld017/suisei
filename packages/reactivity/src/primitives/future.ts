import { observeRef } from '../utils';
import { owner } from '../owner';
import { state } from './state';
import type { Ref, VariableRef } from '../types';

export const future = async <T>(ref: Ref<Promise<T>>): Promise<VariableRef<T>> => {
	const [ value, setValue ] = state<T>(null as unknown as T);
	const [ promise, unobserve ] = observeRef(ref, newPromise => {
		const refetchPromise = newPromise.then(newValue => {
			setValue(newValue);
			owner.onFutureRefetchFinish(refetchPromise);
		});
		
		owner.onFutureRefetchInitialize(refetchPromise);
	});
	
	owner.onEffectSyncInitialize(() => unobserve);
	
	const initialValue = await promise;
	setValue(initialValue);
	
	return value;
};
