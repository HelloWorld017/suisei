import { readContext } from '../contexts';
import type { Context, ContextRegistry, Ref } from '../types';

export const consume =
  (contextRegistry: ContextRegistry): PrimitiveConsume =>
  <T>(context: Context<T>): Ref<T> =>
    readContext(contextRegistry, context);

export type PrimitiveConsume = <T>(context: Context<T>) => Ref<T>;
