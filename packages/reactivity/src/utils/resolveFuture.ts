import { SymbolFutureDescriptor } from '@suisei/shared';
import type { Future, FutureInternal } from '../types/Future';

export const resolveFuture = <T>(future: Future<T>, value: T): void => {
  const descriptor = (future as FutureInternal<T>)[SymbolFutureDescriptor];
  descriptor.handlers?.forEach(handler => handler(value));
  descriptor.handlers = undefined;
  descriptor.value = value;
};
