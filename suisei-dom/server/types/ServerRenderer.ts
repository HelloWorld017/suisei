import { Component, Scheduler } from '@suisei/core';

export type ParsedServerRendererConfig = {
  namespace: {
    namespace: string;
    templateId: string;
    templateClass: string;
    templateDataIntrinsicId: string;
  };

  nonce?: string;
};

export type CorkNode = unknown & { __brand?: 'CorkNode' };

export type ServerRendererInitScripts = 'suspense' | 'hybrid';
export type ServerRenderer = {
  allocateId(): string;
  registerComponent(component: Component): string;
  emit(chunk: string): void;
  forkRenderer(): ServerRenderer;
  mergeRenderer(childRenderer: ServerRenderer, prepend?: () => void): void;
  yieldRenderer(childRenderer: ServerRenderer): void;
  componentMap: WeakMap<Component, string>;
  config: ParsedServerRendererConfig;
  scheduler: Scheduler;
  renderedInitScripts: Set<ServerRendererInitScripts>;
};
