import { Component, SuiseiElement } from 'suisei';
import { Scheduler } from 'suisei/unsafe-internals';

export type ClientRenderer = {
  allocateId(): string;
  registerComponent(component: Component): string;
  emit(chunk: string): void;
  componentMap: WeakMap<Component, string>;
  elementMap: WeakMap<SuiseiElement, Element>;
  scheduler: Scheduler;
};
