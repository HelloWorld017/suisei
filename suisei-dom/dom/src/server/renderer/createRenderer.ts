import { createDefaultScheduler } from '@suisei/core';
import { DEFAULT_NAMESPACE } from '@suisei/shared';
import type { CorkNode, ServerRenderer } from '../types/ServerRenderer';
import type { Component } from '@suisei/core';
import type { Writable } from 'stream';

export type ServerRendererConfig = Partial<{
  namespace: string;
}>;

type StreamRendererStates = {
  _node?: InternalCorkNode;
  _yielded: StreamRenderer[];
};

type StreamRenderer = StreamRendererStates & {
  forkRenderer(): StreamRenderer;
  mergeRenderer(renderer: StreamRenderer, prepend?: () => void): void;
  yieldRenderer(renderer: StreamRenderer): void;
  emit(chunk: string): void;
};

type InternalServerRenderer = ServerRenderer &
  StreamRendererStates & {
    _root: ServerRenderer;
  };

type InternalCorkNode = CorkNode & {
  value: string;
  prev: InternalCorkNode | null;
  next: InternalCorkNode | null;
};

const createStreamRenderer = (
  emitToStream: (chunk: string) => void
): StreamRenderer => {
  let tail: InternalCorkNode | null = null;

  const emit = (chunk: string) => {
    if (!tail) {
      emitToStream(chunk);
      return;
    }

    tail.value += chunk;
  };

  const cork = () => {
    const node = { value: '', prev: tail, next: null };
    if (tail) {
      tail.next = node;
    }

    tail = node;
    return node;
  };

  const uncork = (node: CorkNode, prepend?: () => void) => {
    const internalNode = node as InternalCorkNode;
    const prevNode = internalNode.prev;
    if (prevNode) {
      prevNode.next = internalNode.next;
      prevNode.value += internalNode.value;
    }

    // Write to the stream / previous node
    const oldTail = tail;
    tail = prevNode;

    prepend?.();
    streamRenderer.emit(internalNode.value);
    tail = oldTail;

    // Update tail
    if (tail === node) {
      tail = prevNode;
    }
  };

  const streamRenderer: StreamRenderer = {
    _yielded: [],
    emit,
    forkRenderer() {
      const node = cork();
      const nextRenderer = createStreamRenderer((chunk: string) => {
        node.value += chunk;
      });

      nextRenderer._node = node;
      return nextRenderer;
    },

    mergeRenderer(renderer, prepend) {
      if (!renderer._node) {
        return;
      }

      streamRenderer._yielded.push(...renderer._yielded);
      uncork(renderer._node, prepend);
    },

    yieldRenderer(renderer) {
      streamRenderer._yielded.push(renderer);
    },
  };

  return streamRenderer;
};

export const createRenderer = (
  stream: Writable,
  config?: ServerRendererConfig
): ServerRenderer => {
  let lastId = 0;
  const namespace = config?.namespace ?? DEFAULT_NAMESPACE;
  const streamRenderer = createStreamRenderer(value => stream.write(value));

  const createForkRenderer = (renderer: InternalServerRenderer) => () => {
    const nextRenderer = Object.create(
      renderer._root
    ) as InternalServerRenderer;
    const nextStreamRenderer = streamRenderer.forkRenderer();
    Object.assign(nextRenderer, nextStreamRenderer);

    nextRenderer.forkRenderer = createForkRenderer(nextRenderer);
    return nextRenderer;
  };

  const renderer: Omit<ServerRenderer, keyof StreamRenderer> = {
    allocateId() {
      const id = (++lastId).toString(36);
      return id;
    },

    registerComponent(component: Component) {
      const id = renderer.allocateId();
      renderer.componentMap.set(component, id);

      return id;
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

  const serverRenderer = renderer as InternalServerRenderer;
  Object.assign(serverRenderer, streamRenderer);
  serverRenderer._root = serverRenderer;
  serverRenderer.forkRenderer = createForkRenderer(serverRenderer);

  return serverRenderer;
};
