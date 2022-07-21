import type { Children, Element } from './Element';
import type { Ref } from '@suisei/reactivity';

export type PropBase = Record<string, Ref<any> | Children>;
export type PropValidated<T extends PropBase> =
	& {
		[K in keyof T]:
			K extends 'children'
				? T[K] extends Children<infer N>
					? Children<N>
					: Children

				: T[K] extends Ref<any>
					? T[K]
					: never;
	}
	& { children: Children };

export type PropValidatedWithoutChildren<T extends PropBase> =
	{
		[K in Exclude<keyof T, 'children'>]:
			T[K] extends Ref<any>
				? T[K]
				: never;
	};

export type Propize<T extends PropBase> =
	{ [K in keyof PropValidated<T>]: PropValidated<T>[K] extends Ref<infer T> ? T | Ref<T> : PropValidated<T>[K] };

export type Component<P extends PropBase = PropBase> =
	(props: P) => Element;
