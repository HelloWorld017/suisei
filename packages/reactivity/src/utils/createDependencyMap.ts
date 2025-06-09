import { createOverlayMap, OverlayMap } from '@suisei/shared';
import type {
  DependencyMap,
  DependencyWriteKey,
  OverlayDependencyMap,
} from '../types/DependencyMap';
import type { EffectTask } from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';
import type { OverlaySet } from '@suisei/shared';

const ensureKey = <
  TKey,
  TValue,
  TMap extends {
    get(key: TKey): TValue | undefined;
    set(key: TKey, value: TValue): unknown;
  },
>(
  map: TMap,
  key: TKey,
  constructor: new () => TValue
): TValue => {
  const value = map.get(key);
  if (value) {
    return value;
  }

  const newValue = new constructor();
  map.set(key, newValue);
  return newValue;
};

export const createDependencyMap = (): DependencyMap => {
  const parentMap: WeakMap<EffectTask | Ref, Set<Ref>> = new WeakMap();
  const childrenMap: WeakMap<Ref, Set<EffectTask | Ref>> = new WeakMap();
  const writeKeyMap: WeakMap<EffectTask | Ref, DependencyWriteKey> =
    new WeakMap();

  const fork = () => {
    const parentOverlay = createOverlayMap<EffectTask | Ref, Set<Ref>>(
      parentMap
    );

    const childrenOverlay = new Map<
      Ref,
      Set<EffectTask | Ref> | OverlaySet<EffectTask | Ref>
    >();

    const writeKeyOverlay = createOverlayMap(writeKeyMap);

    return {
      add(writeKey, parent, child) {},
      rewrite(child) {
        const parentSet = parentMap.get(child);
        parentSet?.forEach(parent => {
          childrenMap.get(parent)?.delete(child);
        });
        parentSet?.clear();
      },
      commit() {
        childrenOverlay.commit();
      },
    } satisfies OverlayDependencyMap;
  };

  return {
    add(writeKey, parent, child) {
      if (writeKeyMap.get(child) !== writeKey) {
        return;
      }

      const childrenSet = ensureKey(childrenMap, parent, Set);
      const parentSet = ensureKey(parentMap, child, Set);
      childrenSet.add(parent);
      parentSet.add(parent);
    },
    rewrite(child) {
      const parentSet = parentMap.get(child);
      parentSet?.forEach(parent => {
        childrenMap.get(parent)?.delete(child);
      });
      parentSet?.clear();

      const writeKey = Symbol() as DependencyWriteKey;
      writeKeyMap.set(child, writeKey);
      return writeKey;
    },
    forEachChild(parent, callback) {
      childrenMap.get(parent)?.forEach(callback);
    },
  };
};
