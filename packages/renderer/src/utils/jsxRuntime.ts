import {
  KIND_ELEMENT,
  SymbolElementDescriptor,
  SymbolIs,
} from '@suisei/shared';
import type { Component, UnknownProps } from '../types/Component';
import type { SuiseiElement, SuiseiElementInternal } from '../types/Element';

export const jsx = (
  kind: string | Component,
  props: UnknownProps
): SuiseiElement => {
  const element: SuiseiElementInternal = {
    [SymbolIs]: KIND_ELEMENT,
    [SymbolElementDescriptor]: {
      kind,
      props,
    },
  };

  return element;
};

export const jsxs = jsx;
export const jsxDEV = jsx;
