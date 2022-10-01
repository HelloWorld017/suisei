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
  cork(): CorkNode;
  uncork(node: CorkNode, beforeFlush?: () => void): void;
  getChildRenderer(): [ServerRenderer, CorkNode];
  componentMap: WeakMap<Component, string>;
  config: ParsedServerRendererConfig;
  scheduler: Scheduler;
  renderedInitScripts: Set<ServerRendererInitScripts>;
};
