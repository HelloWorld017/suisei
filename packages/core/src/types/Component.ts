import type { Element } from './Element';
import type { ExtractRefOrRefs, Ref } from '@suisei/reactivity';

export type PropBase = Record<string, Ref<any>>;
export type Propize<P extends PropBase = PropBase> =
	& { [K in keyof P as `$${K & string}`]: P[K] }
	& { [K in keyof P]: ExtractRefOrRefs<P[K]> };

export type Component<P extends PropBase = PropBase> =
	(props: P) => Element;
