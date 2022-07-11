import type { Children, Element } from './Element';
import type { ExtractRefOrRefs, Ref } from '@suisei/reactivity';

export type PropBase =
	& Omit<Record<string, Ref<any>>, 'children'>
	& { children: Children };

export type Propize<P extends PropBase = PropBase> =
	& { [K in Exclude<keyof P, `$${string}` | 'children'> as `$${K & string}`]: P[K] }
	& { [K in Exclude<keyof P, `$${string}` | 'children'>]: ExtractRefOrRefs<P[K]> }
	& { children: P['children'] };

export type Component<P extends PropBase = PropBase> =
	(props: P) => Element;
