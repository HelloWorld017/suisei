import { diffArray } from '../diffArray';

const createArray = (length: number) =>
  Array.from({ length }).map((_, index) => index);

const createMutatedArray = (length: number, shuffleCount: number) => {
  const array = createArray(length);
  const shuffled = array.slice();
  const ops = ['Insert', 'Move', 'Delete'] as const;

  let lastInsertedId = length - 1;
  for (let i = 0; i < shuffleCount; i++) {
    const targetIndex = Math.floor(Math.random() * shuffled.length);
    const op = ops[Math.floor(Math.random() * ops.length)];

    switch (op) {
      case 'Insert':
        shuffled.splice(targetIndex, 0, ++lastInsertedId);
        break;

      case 'Move':
        const sourceIndex = Math.floor(Math.random() * shuffled.length);
        const temp = shuffled[sourceIndex];
        shuffled[sourceIndex] = shuffled[targetIndex];
        shuffled[targetIndex] = temp;
        break;

      case 'Delete':
        shuffled.splice(targetIndex, 1);
        break;
  }

  return { array, shuffled };
};

// Small Shuffle, Small Case
createMutatedArray(16, 1);
