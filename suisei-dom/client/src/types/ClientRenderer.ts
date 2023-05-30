import { Component, SuiseiElement } from 'suisei';
import { Scheduler } from 'suisei/unsafe-internals';

// TODO Make it NodeHandle
export type ElementHandle = {
  alternate(element: Element): () => void;
  get renderResult(): Element;
  destroy(): void;
};

export type ClientRenderer = {
  registerComponent(component: Component): string;
  render(element: SuiseiElement): ClientRenderResult;
  componentMap: WeakMap<Component, string>;
  elementMap: WeakMap<SuiseiElement, ElementHandle>;
  scheduler: Scheduler;
};

export type ClientRenderResult = Promise<ElementHandle> | ElementHandle;
