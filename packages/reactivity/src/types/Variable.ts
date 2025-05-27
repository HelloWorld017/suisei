import type { Future } from './Future';
import type { Ref } from './Ref';

export type Variable<T> = Ref<T> | Future<T>;
