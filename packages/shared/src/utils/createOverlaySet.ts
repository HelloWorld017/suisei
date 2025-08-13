import { E_INTERNAL_UNSUPPORTED_OPERATION } from '../constants';
import { throwError } from './throwError';
import type { OverlaySet } from '../types/OverlaySet';

export const createOverlaySet = <T>(
  parent: Set<T> | OverlaySet<T> | (T extends object ? WeakSet<T> : never)
) => {
  const overlay = new Map<T, boolean>();
  const overlaySet: OverlaySet<T> = {
    add: value => (overlay.set(value, true), overlaySet),
    delete: value => overlaySet.has(value) && (overlay.set(value, false), true),
    has: value => overlay.get(value) ?? parent.has(value),
    commit: () => {
      overlay.forEach((exists, value) =>
        exists ? parent.add(value) : parent.delete(value)
      );
      overlay.clear();
    },
    forEach: callback => {
      if (parent instanceof WeakSet) {
        return throwError(E_INTERNAL_UNSUPPORTED_OPERATION);
      }

      parent.forEach(value => !overlay.has(value) && callback(value));
      overlay.forEach((exists, value) => exists && callback(value));
    },
  };

  return overlaySet;
};
