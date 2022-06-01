import { Ref } from "../types";
import { owner } from '../owner';
import { SymbolIs, SymbolRef } from '@suisei/shared';

export const state = <T>(initialValue: T): [Ref<T>, (newValue: T) => void] => {
	const ref: Ref<T> = ({
		[SymbolIs]: SymbolRef,
		isConstant: false,
		observers: new Set(),
		raw: initialValue,
		from: owner,
	});

	const setValue = (newValue: T): void => {
		if (newValue === ref.raw) {
			return;
		}

		owner.onStateUpdate(ref);
		ref.raw = newValue;
		ref.observers.forEach(observer => {
			observer(newValue);
		});
	};

	return [ref, setValue];
};
