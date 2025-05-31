import { createLinkedList } from '../createLinkedList';

it('basic work', () => {
  const linkedList = createLinkedList<number>();
  const expectOrdering = (truth: number[]) => {
    const fromHead = [];
    const fromTail = [];

    let node = linkedList.head;
    while (node !== null) {
      fromHead.push(node.value);
      node = node.next;
    }

    node = linkedList.tail;
    while (node !== null) {
      fromTail.push(node.value);
      node = node.prev;
    }

    expect(fromHead, 'from head').toStrictEqual(truth);
    expect(fromTail.reverse(), 'from tail').toStrictEqual(truth);
  };

  expectOrdering([]);

  const item10 = linkedList.append(10);
  const item20 = linkedList.append(20);
  const item30 = linkedList.append(30);
  expectOrdering([10, 20, 30]);

  const item15 = linkedList.append(15, item10);
  const item25 = linkedList.append(25, item20);
  linkedList.delete(item30);

  const item35 = linkedList.append(35);
  expectOrdering([10, 15, 20, 25, 35]);

  linkedList.delete(item10);
  expectOrdering([15, 20, 25, 35]);

  linkedList.delete(item35);
  expectOrdering([15, 20, 25]);

  linkedList.delete(item15);
  linkedList.delete(item25);
  expectOrdering([20]);

  linkedList.delete(item20);
  expectOrdering([]);

  linkedList.append(100);
  linkedList.append(200);
  expectOrdering([100, 200]);

  linkedList.concatBefore(createLinkedList());
  expectOrdering([100, 200]);

  const newList = createLinkedList<number>();
  newList.append(20);
  linkedList.concatBefore(newList);
  expectOrdering([20, 100, 200]);
});
