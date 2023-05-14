import { Component, SuiseiElement } from 'suisei';
import {
  ContextRegistry,
  FragmentProps,
  isPromise,
} from 'suisei/unsafe-internals';
import { createScheduler } from '../scheduler';
import { ClientRenderer, ClientRenderResult, ElementHandle } from '../types';

export const createRenderer = (): ClientRenderer => {
  let lastId = 0;
  const componentMap = new WeakMap<Component, string>();
  const elementMap = new WeakMap<SuiseiElement, ElementHandle>();
  const promiseMap = new WeakMap<SuiseiElement, Promise<ElementHandle>>();
  // const templateCacheMap = new Map<symbol, (data: SuiseiElement) => Element>;
  // TODO implement template cache

  const scheduler = createScheduler();

  const renderer = {
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

    async render(
      element: SuiseiElement,
      contextRegistry: ContextRegistry = {}
    ) {
      const cachedResult = elementMap.get(element);
      if (cachedResult) {
        return cachedResult;
      }

      const awaitingResult = promiseMap.get(element);
      if (awaitingResult) {
        return awaitingResult;
      }

      let result: ClientRenderResult;
      if (!element.component) {
        result = renderFragmentElement(
          renderer,
          element.props as FragmentProps,
          contextRegistry
        );
      } else if (typeof element.component === 'string') {
        result = renderIntrinsicElement(
          renderer,
          element.component,
          element.props,
          contextRegistry
        );
      } else {
        result = renderComponentElement(
          renderer,
          element.component,
          element.props,
          contextRegistry
        );
      }

      let elementHandle: ElementHandle;
      if (isPromise(result)) {
        promiseMap.set(element, result);
        elementHandle = await result;
        promiseMap.delete(element);
      } else {
        elementHandle = result;
      }

      elementMap.set(element, elementHandle);
      return elementHandle;
    },
  };

  return renderer;
};
