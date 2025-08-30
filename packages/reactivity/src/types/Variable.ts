import type { Future } from './Future';
import type { Ref } from './Ref';

export type Variable<T> = Ref<T> | Future<T>;
export type VariableSelector = <T>(ref: Variable<T>) => Awaited<T>;
export type VariableHandle = {
  abortSignal: AbortSignal;
};
