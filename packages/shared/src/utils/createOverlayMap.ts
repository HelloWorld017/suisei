import { SymbolOverlayMapDeleted } from '../constants';
import type { OverlayMap } from '../types/OverlayMap';

export const createOverlayMap = <K, V>(
  parent:
    | Map<K, V>
    | (K extends object ? WeakMap<K, V> : never)
    | OverlayMap<K, V>
) => {
  const overlay = new Map<K, V | typeof SymbolOverlayMapDeleted>();
  const overlayMap: OverlayMap<K, V> = {
    get: key => {
      const value = overlay.has(key) ? overlay.get(key) : parent.get(key);
      return value === SymbolOverlayMapDeleted ? undefined : value;
    },
    set: (key, value) => {
      if (overlay.has(key) || parent.get(key) !== value) {
        overlay.set(key, value);
      }

      return overlayMap;
    },
    delete: key => {
      const parentHasValue = parent.has(key);
      const overlayHasValue =
        overlay.has(key) && overlay.get(key) !== SymbolOverlayMapDeleted;

      if (overlayHasValue && !parentHasValue) {
        overlay.delete(key);
        return true;
      }

      if (overlayHasValue || parentHasValue) {
        overlay.set(key, SymbolOverlayMapDeleted);
        return true;
      }

      return false;
    },
    has: key =>
      overlay.has(key)
        ? overlay.get(key) !== SymbolOverlayMapDeleted
        : parent.has(key),
    commit: () => {
      overlay.forEach((value, key) =>
        value === SymbolOverlayMapDeleted
          ? parent.delete(key)
          : parent.set(key, value)
      );
      overlay.clear();
    },
  };

  return overlayMap;
};
