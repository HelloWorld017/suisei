import { OrderedMap } from './orderedMap';

type DiffArrayCallbacks<T> = {
  onInsert: (value: T, after: T | null) => void;
  onDelete: (value: T) => void;
};

const LARGE_THRESHOLD = 16;
export const diffArray = <T>(
  asIs: T[],
  toBe: T[],
  callbacks: DiffArrayCallbacks<T>
) => {
  if (toBe.length < LARGE_THRESHOLD) {
    return diffArraySmall(asIs, toBe, callbacks);
  }

  return diffArrayLarge(asIs, toBe, callbacks);
};

// On < 16
const MAX_LOOKUP_OFFSET = 3;
export const diffArraySmall = <T>(
  asIs: T[],
  toBe: T[],
  { onInsert, onDelete }: DiffArrayCallbacks<T>
) => {
  const addedItems = new Set<T>();

  // Use naive O(N) approach
  let lookupIndex = 0;
  toBe.reduce<T | null>((prevItem, item) => {
    if (asIs[lookupIndex] === item) {
      // Already in-order, skip
      lookupIndex += 1;
      return item;
    }

    // Lookup 0 ~ 3 to calculate skew
    for (
      let lookupOffset = 0;
      lookupOffset < MAX_LOOKUP_OFFSET;
      lookupOffset++
    ) {
      if (asIs[lookupIndex + lookupOffset] === item) {
        // Found case: the items in as-is is not in to-be
        //   Should delete the items
        for (let i = lookupIndex; i < lookupIndex + lookupOffset; i++) {
          if (i >= asIs.length) {
            break;
          }

          const deletingItem = asIs[i];
          if (!addedItems.has(deletingItem)) {
            onDelete(deletingItem);
          }
        }

        lookupIndex += lookupOffset + 1;
        return item;
      }
    }

    // Not found case: the item in to-be is not in as-is
    //   Should add the item
    onInsert(item, prevItem);
    addedItems.add(item);
    return item;
  }, null);

  // Finalize
  for (let i = lookupIndex; i < asIs.length; i++) {
    const deletingItem = asIs[i];
    if (!addedItems.has(deletingItem)) {
      onDelete(deletingItem);
    }
  }
};

// On >= 16
export const diffArrayLarge = <T>(
  asIs: T[],
  toBe: T[],
  { onInsert, onDelete }: DiffArrayCallbacks<T>
) => {
  // Use LIS (Longest Increasing Subsequence) O(N log N) approach,
  //   which does more computing but can reduce DOM API Calls

  // Create value -> order map
  const orderMap = new Map<T, number>();
  toBe.forEach((value, index) => orderMap.set(value, index));

  // Create the LIS, which key is the order
  type Tail = { index: number; prev: Tail | null; size: number };
  const tails = new OrderedMap<Tail>();

  // The tail of the LIS
  const maximumTail = asIs.reduce<Tail | null>((maximumTail, value, index) => {
    const order = orderMap.get(value);
    if (typeof order !== 'number') {
      onDelete(value);
      return maximumTail;
    }

    const lastTail: Tail | null = (() => {
      const highestOrder = maximumTail && orderMap.get(asIs[maximumTail.index]);
      if (typeof highestOrder === 'number' && order > highestOrder) {
        // When the value extends the (currently) longest sequence
        return maximumTail;
      }

      // It does not extends the sequence,
      // but it could be another candidate for the longest sequence
      return tails.highestBounded(order)?.value ?? null;
    })();

    const newTail = {
      index,
      prev: lastTail ?? null,
      size: (lastTail?.size ?? 0) + 1,
    };

    tails.set(order, newTail);
    return !maximumTail || newTail.size > maximumTail.size
      ? newTail
      : maximumTail;
  }, null);

  // Backtrack the tail to get the items set, which is already in-order
  const inOrderItems = (() => {
    const inOrderItems = new Set();
    let backtrackingTail = maximumTail;
    while (backtrackingTail?.prev) {
      inOrderItems.add(asIs[backtrackingTail.index]);
      backtrackingTail = backtrackingTail.prev;
    }

    if (backtrackingTail) {
      inOrderItems.add(asIs[backtrackingTail.index]);
    }

    return inOrderItems;
  })();

  // Find items which order is not correct and call `onInsert` to correct its order
  toBe.reduce<T | null>((prev, value) => {
    if (!inOrderItems.has(value)) {
      onInsert(value, prev);
    }

    return value;
  }, null);
};
