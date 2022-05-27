import { SymbolRef } from '@suisei/shared';
import type { Owner } from './Owner';

export type RefObserver<T> = (newValue: T) => void;
export type Ref<T> = {
	is: typeof SymbolRef;
	key: number;
	raw: T;
	observers: Set<RefObserver<T>>;
	from: Owner | null;
};

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
