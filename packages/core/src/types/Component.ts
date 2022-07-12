import type { Children, Element } from './Element';
import type { ExtractRefOrRefs, Ref } from '@suisei/reactivity';

export type PropBase = Record<string, Ref<any> | Children>;
export type PropValidated<T extends PropBase> =
	& {
		[K in keyof T]:
			K extends 'children'
				? T[K] extends Children<infer N>
					? Children<N>
					: Children

				: K extends `$${string}`
					? T[K] extends Ref<any>
						? T[K]
						: never
					: never;
	}
	& { children: Children };

export type Propize<P extends PropBase = PropBase> =
	| Partial<P>
	| { [K in Exclude<keyof P, 'children'> as K extends `$${infer V}` ? V : never]?: ExtractRefOrRefs<P[K]> };

export type Component<P extends PropBase = PropBase> =
	(props: P) => Element;
