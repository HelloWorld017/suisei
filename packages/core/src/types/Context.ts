import type {
  KIND_CONTEXT,
  SymbolContextDescriptor,
  SymbolIs,
} from '@suisei/shared';

export type Context<T = unknown> = {
  __type?: T;
  [SymbolIs]: typeof KIND_CONTEXT;
};

export type ContextInternal<T = unknown> = Context<T> & {
  [SymbolContextDescriptor]: {
    key: symbol;
    defaultValue: T;
  };
};
