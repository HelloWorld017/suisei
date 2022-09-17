import { createDefaultScheduler } from '@suisei/core';
import { DEFAULT_NAMESPACE } from '@suisei/shared';
import type { ServerRenderer } from '../types/ServerRenderer';
import type { Component } from '@suisei/core';
import type { Writable } from 'stream';

export type ServerRendererConfig = Partial<{
  namespace: string;
}>;

export const createRenderer = (
  stream: Writable,
  config?: ServerRendererConfig
): ServerRenderer => {
  let lastId = 0;
  const namespace = config?.namespace ?? DEFAULT_NAMESPACE;

  const createStreamRenderer = () => {
    let corked = false;
    let corkedValue = '';

    return {
      cork() {
        corked = true;
      },

      uncork(prepend: () => void) {
        corked = false;
        prepend();
        this.emit(corkedValue);

        corkedValue = '';
      },

      emit(chunk: string) {
        if (corked) {
          corkedValue += chunk;
          return;
        }

        stream.write(chunk);
      },
    };
  };

  return {
    ...createStreamRenderer(),

    allocateId() {
      const id = (++lastId).toString(36);
      return id;
    },

    registerComponent(component: Component<any>) {
      const id = this.allocateId();
      this.componentMap.set(component, id);

      return id;
    },

    getChildRenderer() {
      return { ...this, ...createStreamRenderer() };
    },

    config: {
      ...config,
      namespace: {
        namespace: `$${namespace}`,
        templateClass: namespace,
        templateId: namespace,
        templateDataIntrinsicId: `data-${namespace}`,
      },
    },
    componentMap: new WeakMap(),
    scheduler: createDefaultScheduler(),
    renderedInitScripts: new Set(),
  };
};
