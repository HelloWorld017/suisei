import type {
  ElementsAttributes,
  VoidElementsAttributes,
} from '@suisei-dom/htmltypes';

const voidElementNames = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export const isVoidElement = (
  component: keyof ElementsAttributes
): component is keyof VoidElementsAttributes => voidElementNames.has(component);
