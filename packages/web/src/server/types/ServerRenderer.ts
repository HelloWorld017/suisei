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

export type ServerRendererInitScripts = 'suspense' | 'hybrid';

export type ServerRenderer = {
  allocateId(): string;
  registerComponent(component: Component): string;
  emit(chunk: string): void;
  cork(): void;
  uncork(beforeFlush: () => void): void;
  getChildRenderer(): ServerRenderer;
  componentMap: WeakMap<Component, string>;
  config: ParsedServerRendererConfig;
  scheduler: Scheduler;
  renderedInitScripts: Set<ServerRendererInitScripts>;
};
