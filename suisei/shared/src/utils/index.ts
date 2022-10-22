export * from './errors';
export * from './guards';

export const shallowCompare = (
  arrayA: unknown[],
  arrayB: unknown[]
): boolean => {
  const length = arrayA.length;
  if (length !== arrayB.length) {
    return false;
  }

  for (let i = 0; i < length; i++) {
    if (arrayA[i] !== arrayB[i]) {
      return false;
    }
  }

  return true;
};
