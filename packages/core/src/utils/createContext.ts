import {
  KIND_CONTEXT,
  SymbolContextDescriptor,
  SymbolIs,
} from '@suisei/shared';
import type { Context, ContextInternal } from '../types/Context';

export const createContext = <T>(defaultValue: T): Context<T> => {
  const context: ContextInternal<T> = {
    [SymbolIs]: KIND_CONTEXT,
    [SymbolContextDescriptor]: {
      key: Symbol(),
      defaultValue,
    },
  };

  return context;
};
