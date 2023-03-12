import { Component, SuiseiElement } from 'suisei';
import { Scheduler } from 'suisei/unsafe-internals';

export type ClientRenderer = {
  registerComponent(component: Component): string;
  render(element: SuiseiElement): Element;
  componentMap: WeakMap<Component, string>;
  elementMap: WeakMap<SuiseiElement, Element>;
  scheduler: Scheduler;
};
