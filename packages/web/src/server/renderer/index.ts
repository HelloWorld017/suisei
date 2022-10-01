import { createDefaultScheduler } from '@suisei/core';
import { DEFAULT_NAMESPACE } from '@suisei/shared';
import type { CorkNode, ServerRenderer } from '../types/ServerRenderer';
import type { Component } from '@suisei/core';
import type { Writable } from 'stream';

export type ServerRendererConfig = Partial<{
  namespace: string;
}>;

type Node = {
  value: string;
  prev: Node | null;
  next: Node | null;
};

export const createRenderer = (
  stream: Writable,
  config?: ServerRendererConfig
): ServerRenderer => {
  let lastId = 0;
  const namespace = config?.namespace ?? DEFAULT_NAMESPACE;

  const createStreamRenderer = (emitToStream: (chunk: string) => void) => {
    let tail: Node | null = null;

    const streamRenderer = {
      cork() {
        const node = { value: '', prev: tail, next: null };
        if (tail) {
          tail.next = node;
        }

        tail = node;
        return node as CorkNode;
      },

      uncork(node: CorkNode, prepend?: () => void) {
        const prevNode = (node as Node).prev;
        if (prevNode) {
          prevNode.next = (node as Node).next;
          prevNode.value += (node as Node).value;
        }

        // Write to the stream / previous node
        const oldTail = tail;
        tail = prevNode;

        prepend?.();
        streamRenderer.emit((node as Node).value);
        tail = oldTail;

        // Update tail
        if (tail === node) {
          tail = prevNode;
        }
      },

      emit(chunk: string) {
        if (!tail) {
          emitToStream(chunk);
          return;
        }

        tail.value += chunk;
      },
    };

    return streamRenderer;
  };

  const renderer: ServerRenderer = {
    ...createStreamRenderer(value => stream.write(value)),

    allocateId() {
      const id = (++lastId).toString(36);
      return id;
    },

    registerComponent(component: Component) {
      const id = renderer.allocateId();
      renderer.componentMap.set(component, id);

      return id;
    },

    getChildRenderer() {
      const node = renderer.cork();
      const renderToParent = (chunk: string) => {
        (node as Node).value += chunk;
      };

      return [{ ...renderer, ...createStreamRenderer(renderToParent) }, node];
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

  return renderer;
};
