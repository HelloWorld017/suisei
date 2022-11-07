import type {
  ClassName,
  CSSProperties,
  ElementsAttributes,
} from '@suisei-dom/htmltypes';

export const standardAttributeNames = new Map<string, string>([
  ['className', 'class'],
  ['htmlFor', 'for'],
]);

// Preserve Casing
['tabIndex', 'crossOrigin'].forEach(name =>
  standardAttributeNames.set(name, name)
);

const camelize = (name: string): string =>
  name.replace(/[-:]([a-z])/g, token => token[1].toUpperCase());

// Camelize
[
  'accept-charset',
  'http-equiv',

  'accent-height',
  'alignment-baseline',
  'arabic-form',
  'baseline-shift',
  'cap-height',
  'clip-path',
  'clip-rule',
  'color-interpolation',
  'color-interpolation-filters',
  'color-profile',
  'color-rendering',
  'dominant-baseline',
  'enable-background',
  'fill-opacity',
  'fill-rule',
  'flood-color',
  'flood-opacity',
  'font-family',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-variant',
  'font-weight',
  'glyph-name',
  'glyph-orientation-horizontal',
  'glyph-orientation-vertical',
  'horiz-adv-x',
  'horiz-origin-x',
  'image-rendering',
  'letter-spacing',
  'lighting-color',
  'marker-end',
  'marker-mid',
  'marker-start',
  'overline-position',
  'overline-thickness',
  'paint-order',
  'panose-1',
  'pointer-events',
  'rendering-intent',
  'shape-rendering',
  'stop-color',
  'stop-opacity',
  'strikethrough-position',
  'strikethrough-thickness',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'text-anchor',
  'text-decoration',
  'text-rendering',
  'underline-position',
  'underline-thickness',
  'unicode-bidi',
  'unicode-range',
  'units-per-em',
  'v-alphabetic',
  'v-hanging',
  'v-ideographic',
  'v-mathematical',
  'vector-effect',
  'vert-adv-y',
  'vert-origin-x',
  'vert-origin-y',
  'word-spacing',
  'writing-mode',
  'xlink:actuate',
  'xlink:arcrole',
  'xlink:href',
  'xlink:role',
  'xlink:show',
  'xlink:title',
  'xlink:type',
  'xml:base',
  'xml:lang',
  'xml:space',
  'xmlns:xlink',
  'x-height',
].forEach(name => standardAttributeNames.set(camelize(name), name));

export const booleanishAttributeNames = new Set<string>();
// Booleanish
['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(name =>
  booleanishAttributeNames.add(name)
);

// Booleanish + PreserveCasing
[
  'autoReverse',
  'externalResourcesRequired',
  'focusable',
  'preserveAlpha',
].forEach(name => {
  booleanishAttributeNames.add(name);
  standardAttributeNames.set(name, name);
});

export const standardizeAttributeName = (name: string): string => {
  const standardAttributeName = standardAttributeNames.get(name);
  if (typeof standardAttributeName !== 'string') {
    return name.toLowerCase();
  }

  return standardAttributeName;
};

const BOOLEAN_LITERAL_NAME = /^data-|^aria-/;

type AllAttributes = ElementsAttributes[keyof ElementsAttributes];
export const createAttribute = <T extends keyof AllAttributes>(
  rawPropName: T,
  rawPropValue: AllAttributes[T]
): string | true | undefined => {
  if (
    typeof rawPropValue === 'boolean' &&
    !booleanishAttributeNames.has(rawPropName) &&
    !BOOLEAN_LITERAL_NAME.test(rawPropName)
  ) {
    if (!rawPropValue) {
      return undefined;
    }

    return true;
  }

  return String(rawPropValue);
};

export const createClassNameAttribute = (
  classNames: ClassName | ClassName[]
): string | undefined => {
  let classNameValue = '';
  if (typeof classNames === 'string') {
    classNameValue = classNames;
  } else if (Array.isArray(classNames)) {
    classNameValue = classNames
      .map(className => createClassNameAttribute(className))
      .filter(value => value)
      .join(' ');
  } else {
    classNameValue = Object.keys(classNames)
      .filter(key => classNames[key])
      .join(' ');
  }

  return classNameValue || undefined;
};

const IS_NON_DIMENSIONAL =
  /^(-|f[lo].*[^se]$|g.{5,}[^ps]$|z|o[pr]|(W.{5})?[lL]i.*(t|mp)$|an|(bo|s).{4}Im|sca|m.{6}[ds]|ta|c.*[st]$|wido|ini)/;

export const hypenateCssName = (name: string): string => {
  const hypenatedName = name.replace(
    /[A-Z]/g,
    (match: string) => `-${match.toLowerCase()}`
  );

  return hypenatedName;
};

export const standardizeCssValue = <T extends keyof CSSProperties>(
  name: T,
  value: CSSProperties[T]
): string => {
  if (typeof value === 'number' && IS_NON_DIMENSIONAL.test(name)) {
    return `${value}px`;
  }

  return String(value);
};

export const createStyleAttribute = (
  cssObject: CSSProperties
): string | undefined => {
  let styleValue = '';
  const cssNames = Object.keys(cssObject) as (keyof CSSProperties)[];
  for (let i = 0; i < cssNames.length; i++) {
    const cssName = cssNames[i];
    const cssValue = cssObject[cssName];

    styleValue += `${hypenateCssName(cssName)}:${standardizeCssValue(
      cssName,
      cssValue
    )};`;
  }

  return styleValue || undefined;
};
