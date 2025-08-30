import { KIND_CONTEXT, SymbolIs } from '@suisei/shared';
import type { Context } from '../types/Context';

export const createContext = <T>(defaultValue: T): Context<T> => ({
  [SymbolIs]: KIND_CONTEXT,
  key: Symbol(),
  defaultValue,
});
