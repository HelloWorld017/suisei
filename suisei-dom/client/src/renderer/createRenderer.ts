import { Component, SuiseiElement } from 'suisei';
import { createScheduler } from '../scheduler';
import { ClientRenderer } from '../types';

type ElementHandle = {
  id: string;
  renderCache: Element;
  destroy(): void;
};

export const createRenderer = (): ClientRenderer => {
  let lastId = 0;
  const componentMap = new WeakMap<Component, string>();
  const elementMap = new WeakMap<SuiseiElement, Element>();
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

      // TODO
    },
  };
};
