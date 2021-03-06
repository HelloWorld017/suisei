import { VariableRef } from "../types";
import { owner } from '../owner';
import { SymbolIs, SymbolRef, SymbolRefDescriptor, SymbolObservers } from '@suisei/shared';

export const state = <T>(initialValue: T): [VariableRef<T>, (newValue: T) => void] => {
	const ref: VariableRef<T> = ({
		[SymbolIs]: SymbolRef,
		[SymbolRefDescriptor]: {
			id: owner.stateCount++,
			isConstant: false,
			raw: initialValue,
			from: owner,
		},
		[SymbolObservers]: new Set(),
	});

	const setValue = (newValue: T): void => {
		if (newValue === ref[SymbolRefDescriptor].raw) {
			return;
		}

		owner.onStateUpdate(ref);
		ref[SymbolRefDescriptor].raw = newValue;
		ref[SymbolObservers].forEach(observer => {
			observer(newValue);
		});
	};

	return [ref, setValue];
};
