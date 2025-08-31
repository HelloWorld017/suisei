import type {
  KIND_REF,
  REF_KIND_CONSTANT,
  REF_KIND_DERIVED,
  REF_KIND_STATE,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';

export type Ref<T = unknown> = ReadwriteRef<T> | ReadonlyRef<T>;
export type RefSelector = <T>(ref: Ref<T>) => T;

export type ReadwriteRef<T = unknown> = {
  __type?: T;
  [SymbolIs]: typeof KIND_REF;
  [SymbolRefDescriptor]: {
    isReadwrite: true;
  };
};

export type ReadonlyRef<T = unknown> = {
  __type?: T;
  [SymbolIs]: typeof KIND_REF;
  [SymbolRefDescriptor]: {
    isReadwrite: false;
  };
};

export type DerivedRefInternal<T = unknown> = ReadonlyRef<T> & {
  [SymbolRefDescriptor]: {
    kind: typeof REF_KIND_DERIVED;
    derive: (_: RefSelector) => T;
    isMemoized: boolean;
  };
};

export type ReadwriteRefInternal<T = unknown> = ReadwriteRef<T> & {
  [SymbolRefDescriptor]: {
    kind: typeof REF_KIND_DERIVED;
    derive: (_: RefSelector) => T;
    write: (value: T) => void;
    isMemoized: boolean;
  };
};

export type StateRefInternal<T = unknown> = ReadwriteRef<T> & {
  [SymbolRefDescriptor]: { kind: typeof REF_KIND_STATE };
};

export type ConstantRefInternal<T = unknown> = ReadonlyRef<T> & {
  [SymbolRefDescriptor]: {
    kind: typeof REF_KIND_CONSTANT;
    value: T;
  };
};

export type RefInternal<T = unknown> =
  | StateRefInternal<T>
  | ReadwriteRefInternal<T>
  | DerivedRefInternal<T>
  | ConstantRefInternal<T>;
