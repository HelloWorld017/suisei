import { SymbolContextDescriptor } from '@suisei/shared';
import type { Owner } from '../types/Owner';
import type { Context, ContextInternal } from '@suisei/core';

export const readContext = <T>(owner: Owner, context: Context<T>): T => {
  const descriptor = (context as ContextInternal<T>)[SymbolContextDescriptor];
  return descriptor.key in owner.context
    ? (owner.context[descriptor.key] as T)
    : descriptor.defaultValue;
};
