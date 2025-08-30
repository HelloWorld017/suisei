import type { Owner } from '../types/Owner';
import type { Context } from '@suisei/core';

export const readContext = <T>(owner: Owner, context: Context<T>): T =>
  context.key in owner.context
    ? (owner.context[context.key] as T)
    : context.defaultValue;
