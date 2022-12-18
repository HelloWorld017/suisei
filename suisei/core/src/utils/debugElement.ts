import { isConstantRef, isDerivedRef, isRef, isElement } from '@suisei/shared';
import { globalPrimitives } from '../primitives';
import { Component, Element } from '../types';

const getComponentName = (component: Component | string | null) => {
  if (typeof component === 'string') {
    return `[${component}]`;
  }

  if (!component) {
    return '[fragment]';
  }

  return component.name;
};

const indent = (str: string, size: number) => {
  const indentChar = ' '.repeat(size);
  return indentChar + str.replaceAll(/^/gm, indentChar);
};

const prettyPrintFunction = (
  value: (...args: unknown[]) => unknown,
  verboseCut = Infinity
) => {
  let fnSignature = value
    .toString()
    .replace(/\/\/.*\n/g, '')
    .replace(/\s*/g, '')
    .replace(/\/\*.*?\*\//g, '')
    .replace(/\)=>.*/, ')')
    .replace(/{.*/, '')
    .replace(/(.*)=>.*/, '($1)')
    .replace(/^function/, '')
    .replace(/,/g, ', ');

  if (value.name) {
    fnSignature = fnSignature.replace(/^.*\(/, `${value.name}(`);
  }

  if (fnSignature.length < verboseCut) {
    return `𝑓 ${fnSignature}`;
  }

  const [name, argsWithParen] = fnSignature.split('(');
  const args = argsWithParen?.slice(0, argsWithParen.length - 1);

  if (name) {
    const namePrettyPrinted =
      name.length > verboseCut ? `${name.slice(0, verboseCut)}...` : name;
    return `𝑓 ${namePrettyPrinted}`;
  }

  if (args) {
    const argsPrettyPrinted =
      args.length > verboseCut ? `${args.slice(0, verboseCut)}...` : args;
    return `𝑓 (${argsPrettyPrinted})`;
  }

  return '𝑓';
};

const prettyPrintArray = (
  value: unknown[],
  verboseCut = Infinity,
  nextVerboseCut = Infinity
) => {
  const arrayContent =
    value.reduce<string>((arrayPartialContent, currentValue, index) => {
      if (arrayPartialContent.length > verboseCut) {
        return arrayPartialContent;
      }

      let currentPrettyPrinted = prettyPrintValue(currentValue, nextVerboseCut);

      const nextLength =
        arrayPartialContent.length + currentPrettyPrinted.length;

      if (nextLength > verboseCut) {
        currentPrettyPrinted = '...';
      }

      if (index === 0) {
        return ` ${currentPrettyPrinted}`;
      }

      return `${arrayPartialContent}, ${currentPrettyPrinted}`;
    }, '') + ' ';

  return `[${arrayContent}]`;
};

const prettyPrintObject = (
  value: Record<string, unknown>,
  verboseCut = Infinity,
  nextVerboseCut = Infinity
) => {
  const keys = Object.keys(value);
  const objectContent =
    keys.reduce<string>((objectPartialContent, currentKey, currentIndex) => {
      if (objectPartialContent.length > verboseCut) {
        return objectPartialContent;
      }

      const currentPrettyPrinted = prettyPrintValue(
        value[currentKey],
        nextVerboseCut
      );

      let currentEntry = `${currentKey}: ${currentPrettyPrinted}`;

      if (
        objectPartialContent.length +
          currentKey.length +
          currentPrettyPrinted.length >
        verboseCut
      ) {
        currentEntry = '...';
      }

      if (currentIndex === 0) {
        return ` ${currentEntry}`;
      }

      return `${objectPartialContent}, ${currentEntry}`;
    }, '') + ' ';

  return `{${objectContent}}`;
};

const prettyPrintElement = (value: Element) => {
  const props = Object.keys(value.props)
    .reduce((debugOutput, key) => {
      let propValue = value.props[key];
      let propType = '≈';

      if (isRef(value)) {
        propValue = globalPrimitives.useOnce(value);

        if (isDerivedRef(value)) {
          propType = 'λ';
        }

        if (isConstantRef(value)) {
          propType = '∼';
        }

        propType = '±';
      }

      const prettyPrinted = prettyPrintValue(propValue, Infinity, Infinity);
      return debugOutput + `${propType} ${key} = ${prettyPrinted}\n`;
    }, '')
    .trim();

  const componentName = getComponentName(value.component);
  let debugOutput = `${componentName} (\n`;
  debugOutput += `${indent(props, 2)}\n`;
  debugOutput += ')';

  return debugOutput;
};

export const prettyPrintValue = (
  value: unknown,
  verboseCut = Infinity,
  nextVerboseCut = Infinity
): string => {
  if (!__DEV__) {
    return '';
  }

  if (typeof value === 'string') {
    const escapedValue = JSON.stringify(value);
    if (escapedValue.length >= verboseCut) {
      return escapedValue.slice(0, verboseCut) + '..."';
    }

    return escapedValue;
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    const formattedValue = value.toLocaleString();
    if (formattedValue.length >= verboseCut) {
      return formattedValue.slice(0, verboseCut) + '...';
    }

    return formattedValue;
  }

  if (
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  ) {
    return String(value);
  }

  if (typeof value === 'function') {
    return prettyPrintFunction(
      value as (...args: unknown[]) => unknown,
      verboseCut
    );
  }

  if (Array.isArray(value)) {
    return prettyPrintArray(value, verboseCut, nextVerboseCut);
  }

  if (value instanceof Date) {
    return `<Date ${value.toLocaleString()}>`;
  }

  type Tagged = { [Symbol.toStringTag]?: () => string };
  const tag = (value as Tagged)[Symbol.toStringTag]?.();
  if (tag && tag !== 'Object') {
    return `<${tag}>`;
  }

  if (isElement(value)) {
    return prettyPrintElement(value);
  }

  return prettyPrintObject(
    value as Record<string, unknown>,
    verboseCut,
    nextVerboseCut
  );
};

export const debugElement = (element: Element) => {
  if (!__DEV__) {
    return;
  }

  // eslint-disable-next-line no-console
  console.log(prettyPrintValue(element));
};
