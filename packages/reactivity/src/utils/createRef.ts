import { SymbolRef } from "@suisei/shared";
import { owner } from "../sideEffects";
import { Ref } from "../types";

export const createRef = <T>(initialValue: T): Ref<T> => ({
	is: SymbolRef,
	key: ++owner.stateCount,
	observers: new Set(),
	raw: initialValue,
	from: owner,
});
