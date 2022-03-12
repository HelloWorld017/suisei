import { ExtractRefOrRefs, Ref, RefOrRefs } from "../types";
import { createRef } from "../utils";
import { effectBefore } from "./effect";
import { useOnce } from "./useOnce";

export const derive = <R extends RefOrRefs, T>(
	refOrRefs: R,
	computeDerived: (values: ExtractRefOrRefs<R>) => T
): Ref<T>  => {
	const derivedRef = createRef(computeDerived(useOnce(refOrRefs)));
	effectBefore(refOrRefs, (values) => {
		const newValue = computeDerived(values);
		if (derivedRef.raw === newValue) {
			return;
		}

		derivedRef.raw = newValue;
		derivedRef.observers.forEach(observer => {
			observer(newValue);
		});
	});

	return derivedRef;
};
