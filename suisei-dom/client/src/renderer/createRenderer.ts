import { Component, SuiseiElement } from 'suisei';
import { FragmentProps } from 'suisei/unsafe-internals';
import { createScheduler } from '../scheduler';
import { ClientRenderer, ElementHandle } from '../types';

export const createRenderer = (): ClientRenderer => {
  let lastId = 0;
  const componentMap = new WeakMap<Component, string>();
  const elementMap = new WeakMap<SuiseiElement, ElementHandle>();
  // const templateCacheMap = new Map<symbol, (data: SuiseiElement) => Element>;
  // TODO implement template cache

  const scheduler = createScheduler();

  return {
    componentMap,
    elementMap,
    scheduler,
    registerComponent(component: Component) {
      const registeredId = componentMap.get(component);
      if (typeof registeredId === 'string') {
        return registeredId;
      }

      const newId = (++lastId).toString(36);
      componentMap.set(component, newId);
      return newId;
    },

    render(element) {
      const cachedResult = elementMap.get(element);
      if (cachedResult) {
        return cachedResult;
      }

      if (!element.component) {
        element.props as FragmentProps;
      }
    },
  };
};
