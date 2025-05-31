export type LinkedList<T> = {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  append(value: T, previousNode?: LinkedListNode<T>): LinkedListNode<T>;
  delete(node: LinkedListNode<T>): T;
  concatBefore(list: LinkedList<T>): void;
};

export type LinkedListNode<T> = {
  prev: LinkedListNode<T> | null;
  next: LinkedListNode<T> | null;
  value: T;
};
