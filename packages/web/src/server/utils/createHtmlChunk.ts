import {
  createAttribute,
  createClassNameAttribute,
  createStyleAttribute,
  encodeEntities,
  isUnsafeAttributeName,
  standardizeAttributeName,
} from '../../shared';
import type { ElementsAttributes } from '@suisei/htmltypes';

const VOID_ELEMENTS =
  /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

type AttributeHandler = (value: unknown) => string;
const attributeHandlers = new Map<string, AttributeHandler>();
attributeHandlers.set(
  'className',
  createClassNameAttribute as AttributeHandler
);
attributeHandlers.set('style', createStyleAttribute as AttributeHandler);

export const createHtmlOpenChunk = <T extends keyof ElementsAttributes>(
  tagName: T,
  props: ElementsAttributes[T]
): string => {
  let s = '<' + tagName;
  const propNames = Object.keys(props);

  for (let i = 0; i < propNames.length; i++) {
    type PropName = keyof ElementsAttributes[keyof ElementsAttributes];
    const rawPropName = propNames[i] as PropName;
    const rawPropValue = props[rawPropName];

    const propName = standardizeAttributeName(rawPropName);
    if (isUnsafeAttributeName(propName)) {
      continue;
    }

    let propValue: string | true | undefined;
    const handler = attributeHandlers.get(rawPropName);
    if (handler) {
      propValue = handler(rawPropValue);
    } else {
      propValue = createAttribute(rawPropName, rawPropValue);
    }

    if (typeof propValue === 'undefined') {
      continue;
    }

    if (propValue === true) {
      s += ` ${propName}`;
      continue;
    }

    s += ` ${propName}="${encodeEntities(propValue)}"`;
  }

  s += '>';

  return s;
};

export const createHtmlChunk = <T extends keyof ElementsAttributes>(
  tagName: T,
  props: ElementsAttributes[T],
  children: string
): string => {
  let s = createHtmlOpenChunk(tagName, props);

  if (VOID_ELEMENTS.test(tagName)) {
    return s;
  }

  s += children;
  s += `</${tagName}>`;

  return s;
};
