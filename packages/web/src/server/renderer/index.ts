import { createScheduler } from '../scheduler/createScheduler';
import { nanoid } from 'nanoid';
import { DEFAULT_NAMESPACE } from '@suisei/shared';
import type { Component } from '@suisei/core';
import type { ServerRenderer } from '../types/ServerRenderer';
import type { Writable } from 'stream';

export let renderer: ServerRenderer;

export type ServerRendererConfig = Partial<{
	namespace: string;
}>;

export const runWithRenderer = <T>(stream: Writable, fn: () => T, config?: ServerRendererConfig): T => {
	let length = 5;
	const allocatedIds = new Set();
	const previousRenderer = renderer;
	const namespace = config?.namespace ?? DEFAULT_NAMESPACE;
	renderer = {
		registerComponent(component: Component<any>) {
			let id = nanoid(length);

			let collision = 0;
			while (allocatedIds.has(id)) {
				collision++;

				if (collision >= 3) {
					length++;
					collision = 0;
				}

				id = nanoid(length);
			}

			allocatedIds.add(id);
			this.componentMap.set(component, id);
			return id;
		},

		emit(chunk) {
			stream.write(chunk);
		},

		config: {
			...config,
			namespace: {
				hybridRender: `$${namespace}`,
				templateClass: namespace,
				templateDataComponentId: `data-${namespace}`,
				templateDataIntrinsicId: `data-${namespace}`
			}
		},
		componentMap: new WeakMap(),
		scheduler: createScheduler()
	};

	const value = fn();
	renderer = previousRenderer;

	return value;
};
