import { Component, SuiseiElement } from 'suisei';
import { Scheduler } from 'suisei/unsafe-internals';

export type ClientRenderer = {
  registerComponent(component: Component): string;
  render(element: SuiseiElement): ClientRenderResult;
  componentMap: WeakMap<Component, string>;
  elementMap: WeakMap<SuiseiElement, Node>;
  scheduler: Scheduler;
};

export type ClientRenderResult = Promise<Node> | Node;
