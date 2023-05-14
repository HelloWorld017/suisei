import { ElementHandle } from '../types';

export const createElementHandle = (element: Element): ElementHandle => {
  const renderResult = element;
  let activeResult = element;
  let lastAlternation: symbol | null = null;

  return {
    alternate(alternateWith: Element) {
      const currentAlternation = Symbol();
      lastAlternation = currentAlternation;
      activeResult.replaceWith(alternateWith);
      activeResult = alternateWith;

      return () => {
        if (lastAlternation === currentAlternation) {
          alternateWith.replaceWith(renderResult);
          activeResult = renderResult;
        }
      };
    },

    get renderResult() {
      return renderResult;
    },

    destroy() {
      activeResult.remove();
    },
  };
};
