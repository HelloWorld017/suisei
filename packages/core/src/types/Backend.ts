import type { Component, PropBase } from './Component';
import type { Element } from './Element';
import type { Ref } from './Ref';

export type Backend = {
	createIntrinsicElement: (componentName: string, props: Record<string, Ref<any>>) => Element;
	createComponentElement: <P extends PropBase = PropBase>
		(component: Component<P>, props: P) => Element;
}
