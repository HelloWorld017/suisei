import { isConstantRef, isVariableRef } from '@suisei/shared';
import { owner } from '../owner';
import { readRef } from './readRef';
import { DerivedRefObservedMemo, Ref, RefObserver, RefOrRefs, RefSelector } from '../types';
import { SymbolMemoizedValue, SymbolObservers } from '@suisei/shared';

export const observeRef = <T>(ref: Ref<T>, observer: RefObserver<T>): [T, () => void] => {
	if (isConstantRef<T>(ref)) {
		return [ref.raw, () => {}];
	}

	if (isVariableRef<T>(ref)) {
		ref.observers.add(observer);
		return [ref.raw, () => ref.observers.delete(observer)];
	}

	const unsubscribe = () => {
		const observers = ref[SymbolObservers];
		if (!observers) {
			return;
		}

		observers.delete(observer);
		if (observers.size !== 0) {
			return;
		}

		const memo = ref[SymbolMemoizedValue];
		if (!memo?.observed) {
			return;
		}

		memo.refCleanups.forEach(cleanup => cleanup());
		delete ref[SymbolMemoizedValue];
	};

	const observers = ref[SymbolObservers];
	const memo = ref[SymbolMemoizedValue];
	if (observers && memo?.observed) {
		observers.add(observer);
		return [ memo.value, unsubscribe ];
	}

	let currentTaskId: number | null = null;
	const update = () => {
		const oldMemo = ref[SymbolMemoizedValue];
		const newMemo = ((): DerivedRefObservedMemo<T | undefined> => {
			if (oldMemo?.observed) {
				return oldMemo;
			}

			return { value: undefined, refCleanups: new Map(), observed: true };
		})();

		const subscribe = () => {
			if (currentTaskId === null) {
				currentTaskId = owner.scheduler.queueTask(() => {
					currentTaskId = null;
					update();
				});
			}
		};

		const unusedDependencies = new Set(newMemo.refCleanups.keys());
		const selector: RefSelector = (refOrRefs: RefOrRefs) => {
			if (Array.isArray(refOrRefs)) {
				return refOrRefs.map(selector);
			}

			if (newMemo.refCleanups.has(refOrRefs)) {
				unusedDependencies.delete(refOrRefs);
				return readRef(refOrRefs);
			}

			const [value, cleanup] = observeRef(refOrRefs, subscribe);
			newMemo.refCleanups.set(refOrRefs, cleanup);

			return value;
		};

		const value = ref(selector);
		unusedDependencies.forEach(dependency => {
			newMemo.refCleanups.get(dependency)?.();
			newMemo.refCleanups.delete(dependency);
		});

		newMemo.value = value;
		ref[SymbolMemoizedValue] = newMemo as DerivedRefObservedMemo<T>;

		if (oldMemo && oldMemo.value !== newMemo.value) {
			const observers = ref[SymbolObservers];
			if (observers) {
				observers.forEach(observer => observer(value));
			}
		}

		return value;
	};

	ref[SymbolObservers] = new Set([ observer ]);
	return [update(), unsubscribe];
};
