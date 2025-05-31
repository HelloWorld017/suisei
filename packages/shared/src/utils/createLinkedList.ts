import type { LinkedList, LinkedListNode } from '../types/LinkedList';

export const createLinkedList = <T>(): LinkedList<T> => {
  const list: LinkedList<T> = {
    head: null,
    tail: null,
    append: (value: T, previousNode) => {
      const node: LinkedListNode<T> = { prev: null, next: null, value };

      const position = previousNode ?? list.tail;
      if (!position) {
        list.head = list.tail = node;
        return node;
      }

      node.prev = position;
      node.next = position.next;
      position.next = node;

      if (node.next) {
        node.next.prev = node;
      }

      if (list.tail === position) {
        list.tail = node;
      }

      return node;
    },
    delete: node => {
      if (list.head === node) {
        list.head = node.next;
      }

      if (list.tail === node) {
        list.tail = node.prev;
      }

      if (node.prev) {
        node.prev.next = node.next;
      }

      if (node.next) {
        node.next.prev = node.prev;
      }

      return node.value;
    },
    concatBefore: (concatingList: LinkedList<T>) => {
      if (concatingList.tail) {
        concatingList.tail.next = list.head;

        if (list.head) {
          list.head.prev = concatingList.tail;
        }
      }

      list.head = concatingList.head ?? list.head;

      concatingList.head = null;
      concatingList.tail = null;
    },
  };

  return list;
};
