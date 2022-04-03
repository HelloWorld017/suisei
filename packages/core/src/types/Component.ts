import type { Element } from './Element';

export type Component<P extends Record<string, any> = Record<string, unknown>> =
	(props: P) => Element;
