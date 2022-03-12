import { Ref } from "../types";
import { owner } from '../owner';
import { createRef } from "../utils/createRef";

export const state = <T>(initialValue: T): [Ref<T>, (newValue: T) => void] => {
	const ref = createRef(initialValue);

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
