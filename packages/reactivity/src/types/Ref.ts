import type { Owner } from './Owner';
import type { SymbolIs, SymbolMemoizedValue, SymbolObservers, SymbolRef, SymbolRefDescriptor } from '@suisei/shared';

export type RefObserver<T> = (newValue: T) => void;
export type RefSelector = <T extends RefOrRefs>(ref: T) => ExtractRefOrRefs<T>;
export type RefDerivator<T> = (_: RefSelector) => T;

export type VariableRef<T> = {
	[SymbolIs]: typeof SymbolRef;
	[SymbolRefDescriptor]: {
		id: number;
		isConstant: false;
		raw: T;
		from: Owner | null;
	};
	[SymbolObservers]: Set<RefObserver<T>>;
};

export type ConstantRef<T> = {
	[SymbolIs]: typeof SymbolRef;
	[SymbolRefDescriptor]: {
		id: number;
		isConstant: true;
		raw: T;
		from: Owner | null;
	};
};

export type DerivedRefObservedMemo<T> =
	{ value: T, refCleanups: Map<Ref<unknown>, () => void>, observed: true };

export type DerivedRefUnobservedMemo<T> =
	{ value: T, refs: Ref<any>[], refValues: any[], observed: false };

export type DerivedRef<T> = RefDerivator<T> & {
	[SymbolMemoizedValue]?: DerivedRefObservedMemo<T> | DerivedRefUnobservedMemo<T>
	[SymbolObservers]?: Set<RefObserver<T>>;
};

export type Ref<T> = VariableRef<T> | ConstantRef<T> | DerivedRef<T>;

export type RefOrRefs = [Ref<any>, ...Ref<any>[]] | Ref<any>;

export type ExtractRefs<R extends any[]> =
	R extends [Ref<infer T>, ...infer Rest]
		? [T, ...ExtractRefs<Rest>]
		: R extends []
			? []
			: never;

export type ExtractRefOrRefs<R> = R extends any[]
	? ExtractRefs<R>
	: R extends Ref<infer T>
		? T
		: never;

export type PackToRef<R> = R extends Ref<any> ? R : Ref<R>;
