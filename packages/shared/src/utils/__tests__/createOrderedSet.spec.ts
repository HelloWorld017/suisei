import { createOrderedSet } from '../createOrderedSet';
import type { OrderedSet } from '../../types/OrderedSet';

it('basic work', () => {
  type T = { key: string };
  const orderedSet = createOrderedSet<T>();
  const referenceInternal = [] as [number, T][];

  const reference: OrderedSet<T> = {
    size: () => referenceInternal.length,
    has: (value: T) =>
      !!referenceInternal.find(([, existing]) => existing === value),

    insert: (priority: number, value: T) => {
      if (reference.has(value)) {
        return;
      }

      referenceInternal.push([priority, value]);
      referenceInternal.sort(
        ([priorityA], [priorityB]) => priorityB - priorityA
      );
    },
    deleteMin: () => referenceInternal.pop()?.[1] ?? null,
    peek: () => referenceInternal.at(-1)?.[1] ?? null,
  };

  const pool = Array.from({ length: 32 }).map(() => ({
    key: Math.random().toString(36).slice(2, 7),
  }));

  const ops = ['size', 'insert', 'deleteMin', 'has', 'peek'] as const;
  for (let i = 0; i < 4096; i++) {
    const operation = ops[~~(Math.random() * ops.length)];
    const target = pool[~~(Math.random() * pool.length)];

    const args = (
      operation === 'has'
        ? ([target] as const)
        : ([Math.random(), target] as const)
    ) as [never, never];

    const outputReference = reference[operation](...args);
    const output = orderedSet[operation](...args);

    expect(output, `Failed on operation ${operation}`).toBe(outputReference);
  }
});
