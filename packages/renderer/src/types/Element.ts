import type { Component } from './Component';
import type {
  KIND_ELEMENT,
  KIND_REF,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';

export type SuiseiElement = {
  [SymbolIs]: typeof KIND_ELEMENT;
};

export type SuiseiElementInternal = SuiseiElement & {
  kind: Component | string | null;
  props: Record<string, unknown>;
};

export type SuiseiNode =
  | SuiseiElement
  | ReadonlyArray<SuiseiElement>
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | {
      // Hack to avoid circular reference
      [SymbolIs]: typeof KIND_REF;
      [SymbolRefDescriptor]: { __type?: SuiseiNode };
    };

export type Children<TCount extends number = number> = SuiseiNode[] & {
  length: TCount;
};
