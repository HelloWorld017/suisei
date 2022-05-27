import { Component, Scheduler } from '@suisei/core';

export type ParsedServerRendererConfig = {
	namespace: {
		hybridRender: string;
		templateClass: string;
		templateDataComponentId: string;
		templateDataIntrinsicId: string;
	}
};

export type ServerRenderer = {
	emit(chunk: string): void;
	registerComponent(component: Component<any>): string;
	componentMap: WeakMap<Component<any>, string>;
	config: ParsedServerRendererConfig;
	scheduler: Scheduler;
};
