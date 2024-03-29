import { createElement } from 'suisei';
import { SymbolIs } from 'suisei/unsafe-internals';
import type { SuiseiElement as Element } from 'suisei';

export const hybrid = (element: Element): Element => {
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
