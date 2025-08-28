import { KIND_ELEMENT, SymbolIs } from '@suisei/shared';
import type { Component, UnknownProps } from '../types/Component';
import type { SuiseiElementInternal } from '../types/Element';

export const jsx = (kind: string | Component, props: UnknownProps) =>
  ({
    [SymbolIs]: KIND_ELEMENT,
    kind,
    props,
  }) satisfies SuiseiElementInternal;
