import type { OverlaySet } from '../types/OverlaySet';

export const createOverlaySet = <T>(parent: Set<T> | OverlaySet<T>) => {
  const overlay = new Map<T, boolean>();
  const overlaySet: OverlaySet<T> = {
    add: value => (!parent.has(value) && overlay.set(value, true), overlaySet),
    delete: value =>
      overlay.get(value) === true
        ? overlay.delete(value)
        : parent.has(value) && overlay.set(value, false) && true,
    has: value => overlay.get(value) ?? parent.has(value),
    commit: () => {
      overlay.forEach((exists, value) =>
        exists ? parent.add(value) : parent.delete(value)
      );
      overlay.clear();
    },
    forEach: callback => {
      parent.forEach(value => !overlay.has(value) && callback(value));
      overlay.forEach((exists, value) => exists && callback(value));
    },
  };

  return overlaySet;
};
