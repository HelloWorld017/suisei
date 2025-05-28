import { createMinHeap } from '../createMinHeap';
import type { MinHeap } from '../../types/MinHeap';

it('basic work', () => {
  const heap = createMinHeap<string>();
  const referenceInternal: [number, string][] = [];
  const reference: MinHeap<string> = {
    size: () => referenceInternal.length,
    insert: (priority: number, value: string) => {
      referenceInternal.push([priority, value]);
      referenceInternal.sort(
        ([priorityA], [priorityB]) => priorityB - priorityA
      );
    },
    delete: () => referenceInternal.pop()?.[1] ?? null,
    peek: () => referenceInternal.at(-1)?.[1] ?? null,
  };

  const ops = ['size', 'insert', 'delete', 'peek'] as const;
  for (let i = 0; i < 2000; i++) {
    const operation = ops[~~(Math.random() * ops.length)];

    const args = [
      Math.random(),
      Math.random().toString(36).slice(2, 7),
    ] as const;

    const outputReference = reference[operation](...args);
    const output = heap[operation](...args);

    expect(output).toBe(outputReference);
  }
});
