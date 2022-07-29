import type { Children, Element } from './Element';
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

export type Propize<T extends PropsBase> =
	{
		[K in keyof PropsValidated<T>]:
			PropsValidated<T>[K] extends Ref<infer T>
				? T | Ref<T>
				: PropsValidated<T>[K]
	};

export type Component<P extends PropsBase = PropsBase> =
	(props: P, $: Primitives) => Element | Promise<Element>;
