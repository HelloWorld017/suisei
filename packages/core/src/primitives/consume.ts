import { readContext } from '../contexts';
import type { Context, ContextRegistry } from '../types';

export const consume =
  (contextRegistry: ContextRegistry): PrimitiveConsume =>
  <T>(context: Context<T>): T =>
    readContext(contextRegistry, context);

export type PrimitiveConsume = <T>(context: Context<T>) => T;
