import type { MinHeap } from '../types/MinHeap';

type HeapNode<T, TPriority> = [TPriority, T];

export const createMinHeap = <
  TValue,
  TPriority extends number = number,
>(): MinHeap<TValue, TPriority> => {
  const heap: (HeapNode<TValue, TPriority> | null)[] = [null];
  const size = () => heap.length - 1;
  const swim = (index: number) => {
    const parent = ~~(index / 2);
    if (heap[parent] && heap[parent][0] > heap[index]![0]) {
      [heap[parent], heap[index]] = [heap[index], heap[parent]];
      return swim(parent);
    }
  };

  const sink = (index: number) => {
    const childA = index * 2;
    const childB = index * 2 + 1;

    if (
      heap[childB] &&
      heap[childA]![0] > heap[childB][0] &&
      heap[index]![0] > heap[childB][0]
    ) {
      [heap[index], heap[childB]] = [heap[childB], heap[index]];
      return sink(childB);
    }

    if (heap[childA] && heap[index]![0] > heap[childA][0]) {
      [heap[index], heap[childA]] = [heap[childA], heap[index]];
      return sink(childA);
    }
  };

  const deleteMin = (): TValue | null => {
    if (heap.length <= 1) {
      return null;
    }

    [heap[1], heap[heap.length - 1]] = [heap[heap.length - 1], heap[1]];
    const value = heap.pop()!;
    sink(1);

    return value[1];
  };

  const insert = (priority: TPriority, value: TValue) => {
    heap.push([priority, value]);
    swim(heap.length - 1);
  };

  const peek = (): TValue | null => heap[1]?.[1] ?? null;
  const peekPriority = (): TPriority | null => heap[1]?.[0] ?? null;

  return {
    size,
    insert,
    delete: deleteMin,
    peek,
    peekPriority,
  };
};
