import type { Element } from './Element';
import type { Ref } from '@suisei/reactivity';

export type Component<P extends Record<string, Ref<any>> = Record<string, Ref<unknown>>> =
	(props: P) => Element;
