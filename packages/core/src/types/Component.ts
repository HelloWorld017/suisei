import type { Element, Node } from './Element';
import type { ExtractRefOrRefs, Ref } from '@suisei/reactivity';

export type PropBase =
	& Omit<Record<string, Ref<any>>, 'children'>
	& { children: Node };

export type Propize<P extends PropBase = PropBase> =
	& { [K in Exclude<keyof P, 'children'> as `$${K & string}`]: P[K] }
	& { [K in Exclude<keyof P, 'children'>]: ExtractRefOrRefs<P[K]> }
	& { children: Node };

export type Component<P extends PropBase = PropBase> =
	(props: P) => Element;
