import { bench } from 'vitest';
import { createMinHeap } from '../createMinHeap';

bench('min heap 60k ops', () => {
  const heap = createMinHeap<number>();
  for (let i = 0; i < 20000; i++) {
    heap.insert(Math.random(), i);
  }

  for (let i = 0; i < 10000; i++) {
    heap.delete();
  }

  for (let i = 0; i < 10000; i++) {
    heap.insert(Math.random(), i);
  }

  for (let i = 0; i < 20000; i++) {
    heap.delete();
  }
});
