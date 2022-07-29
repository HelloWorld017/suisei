import type { Component, PropsBase, PropsValidated } from './Component';
import type { Element } from './Element';
import type { Ref } from './Ref';

export type Backend = {
	createIntrinsicElement: (componentName: string, props: Record<string, Ref<any>>) => Element;
	createComponentElement: <P extends PropsBase = PropsBase>
		(component: Component<P>, props: PropsValidated<P>) => Element;
}
