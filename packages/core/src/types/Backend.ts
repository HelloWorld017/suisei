import type { Component } from './Component';
import type { Element } from './Element';
import type { Ref } from './Ref';

export type Backend = {
	createIntrinsicElement: (componentName: string, props: Record<string, Ref<any>>) => Element;
	createComponentElement: (component: Component, props: Record<string, Ref<any>>) => Element;
}
