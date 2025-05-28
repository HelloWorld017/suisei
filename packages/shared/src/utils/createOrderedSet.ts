import { createMinHeap } from './createMinHeap';
import type { OrderedSet } from '../types/OrderedSet';

export const createOrderedSet = <
  TValue extends object,
  TPriority extends number = number,
>(): OrderedSet<TValue, TPriority> => {
  const minHeap = createMinHeap<TValue, TPriority>();
  const valueSet = new WeakSet<TValue>();
  const insert = (priority: TPriority, value: TValue) => {
    if (!valueSet.has(value)) {
      valueSet.add(value);
      minHeap.insert(priority, value);
    }
  };

  const deleteMin = () => {
    const value = minHeap.delete();
    if (value !== null) {
      valueSet.delete(value);
    }

    return value;
  };

  return {
    ...minHeap,
    has: (value: TValue) => valueSet.has(value),
    insert,
    deleteMin,
  };
};
