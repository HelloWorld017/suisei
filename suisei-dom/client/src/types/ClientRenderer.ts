import { Component, SuiseiElement } from 'suisei';
import { EffectCleanup, Scheduler } from 'suisei/unsafe-internals';

export type ClientRenderer = {
  registerComponent(component: Component): string;
  render(element: SuiseiElement): ClientRenderResult;
  componentMap: WeakMap<Component, string>;
  elementMap: WeakMap<SuiseiElement, Node>;
  scheduler: Scheduler;
};

export type ClientRenderResult =
  | Promise<readonly [Node | null, EffectCleanup | null]>
  | readonly [Node | null, EffectCleanup | null];
