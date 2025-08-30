import type { Ref } from './Ref';

export type Future<T> = Ref<Promise<T>>;
