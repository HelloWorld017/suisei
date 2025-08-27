import type { MinHeap } from './MinHeap';
import type { Simplify } from './Simplify';

export type OrderedSet<T, TPriority extends number = number> = Simplify<
  Omit<MinHeap<T, TPriority>, 'delete'> & {
    has(value: T): boolean;
    delete(value: T): boolean;
    deleteMin: MinHeap<T, TPriority>['delete'];
  }
>;
