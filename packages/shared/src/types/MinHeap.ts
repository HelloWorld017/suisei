export type MinHeap<T, TPriority extends number = number> = {
  insert(priority: TPriority, value: T): void;
  delete(): T | null;
  peek(): T | null;
  peekPriority(): TPriority | null;
  size(): number;
};
