import type { Owner } from './Owner';
import type { SymbolFutureRef, SymbolIs, SymbolMemoizedValue, SymbolRef } from '@suisei/shared';

export type RefObserver<T> = (newValue: T) => void;
export type RefSelector = <T extends RefOrRefs>(ref: T) => ExtractRefOrRefs<T>;
export type RefDerivator<T> = (_: RefSelector) => T;

export type VariableRef<T> = {
	[SymbolIs]: typeof SymbolRef;
	isConstant: false;
	raw: T;
	observers: Set<RefObserver<T>>;
	from: Owner | null;
};

export type ConstantRef<T> = {
	[SymbolIs]: typeof SymbolRef;
	isConstant: true;
	raw: T;
	from: Owner | null;
};

export type FutureRef<T> = RefDerivator<T> & {
	[SymbolIs]: typeof SymbolFutureRef;
};

export type DerivedRef<T> = RefDerivator<T> & {
	[SymbolMemoizedValue]?: { value: T, refValues: any[] }
};

export type Ref<T> = VariableRef<T> | ConstantRef<T> | DerivedRef<T> | FutureRef<T>;

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
