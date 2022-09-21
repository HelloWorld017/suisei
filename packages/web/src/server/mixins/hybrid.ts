import { createElement } from '@suisei/core';
import { SymbolIs } from '@suisei/shared';
import type { Component, Element, PropsBase } from '@suisei/core';

export const hybrid =
  <P extends PropsBase>(component: Component<P>): Component<P> =>
  ({ children, ...props }: PropsValidated<P>) => {
    const element = createElement(component, props);

    // TODO Handle Suspense
    // > 1. notify the renderer that it has a hybrid + suspense component
    // > 2. make sure the renderer have rendered the `$suih` function
    // > 3. render placeholder element
    // > 4. render script element

    // TODO Notify Renderer
    // > 1. notify the renderer that it has a hybrid component
    // > 2. make sure the renderer have rendered the `$sui` function
    // > 3. then render script element

    const componentId = renderer.componentMap.get(component)!;
    const registeredComponentId =
      componentId || renderer.registerComponent(component);

    const scriptElement: Element = {
      [SymbolIs]: SymbolIntrinsicElement,
      name: 'script',
      attributes: {},
      children: [
        `${renderer.config.namespace.hybridRender}("${registeredComponentId}", )`,
      ],
    };

    if (!registeredComponentId) {
      return {
        [SymbolIs]: SymbolIntrinsicElement,
        name: 'template',
        attributes: {
          [renderer.config.namespace.templateDataComponentId]:
            constant(componentId),
        },
        children: [element],
      } as Element;
    }

    return scriptElement;
  };
