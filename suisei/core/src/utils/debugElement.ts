import { isConstantRef, isVariableRef, isDerivedRef, isRef } from '@suisei/shared';
import { Component, Element, Ref } from '../types';

const getComponentName = (component: Component | string | null) => {
  if (!component) {
    return '[fragment]';
  }

  if (typeof component === 'string') {
    return `[${component}]`;
  }

  return component.name;
};

export const debugElement = (element: Element) => {
  if (!__DEV__) {
    return;
  }

  const indent = (str: string, size: number) => {
    const indentChar = ' '.repeat(size);
    return indentChar + str.replaceAll('\n', `\n${indentChar}`);
  };

  const debugProp = (props: Record<string, Ref<unknown> | unknown>) => {
    Object.keys(props).reduce((debugOutput, key) => {
      const value = props[key];
      if (isRef(value))
      return debugOutput + `${key}=`
    }, '');
  }

  /*
  Html (
	λ derived = 3
	∼ const = 1
	≈ const = 1
	± variable = 5
	≈ children = div (

	)
)*/

  const debugElementImpl = (element: Element, depth = 0) => {
    const componentName = getComponentName(element.component);
    let debugOutput = `${componentName} (`;
      for (element.props)
    debugOutput += '';
  };
};
