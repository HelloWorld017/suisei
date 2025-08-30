import type { KIND_CONTEXT, SymbolIs } from '@suisei/shared';

export type Context<T = unknown> = {
  [SymbolIs]: typeof KIND_CONTEXT;
  key: symbol;
  defaultValue: T;
};
