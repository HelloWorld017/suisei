import type { Children, Element } from './Element';
import type { PartialByUndefined } from '@suisei/shared';
import type { Primitives } from '../primitives';
import type { Ref } from '@suisei/reactivity';

export type Props<T extends Component<any>> =
	T extends Component<infer P>
		? P
		: never;

export type PropsBase = Record<string, Ref<any> | Children>;
export type PropsValidated<T extends PropsBase> =
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

export type PropsValidatedWithoutChildren<T extends PropsBase> =
	{
		[K in Exclude<keyof T, 'children'>]:
			T[K] extends Ref<any>
				? T[K]
				: never;
	};

type PropizeImpl<T extends PropsBase> =
	& {
		[K in keyof PropsValidated<T>]:
			PropsValidated<T>[K] extends Ref<infer T>
				? T | Ref<T>
				: PropsValidated<T>[K];
	}
	& { key?: string | Ref<string> };

export type Propize<T extends PropsBase> = PartialByUndefined<PropizeImpl<T>>;
export type Depropize<T> =
	{
		[K in keyof T]: T[K] | Ref<T[K]>
	};

export type Component<P extends PropsBase = PropsBase> =
	(props: PropsValidated<P>, $: Primitives) => Element | Promise<Element>;
