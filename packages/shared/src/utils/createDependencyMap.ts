import type { DependencyMap, DependencyWriteKey } from '../types/DependencyMap';

export const createDependencyMap = <
  TParent extends object,
  TChild extends object = TParent,
>(): DependencyMap<TParent, TChild> => {
  const keyMap = new WeakMap<TChild, DependencyWriteKey>();
  const parentToChildMap = new WeakMap<
    TParent,
    Map<TChild, DependencyWriteKey>
  >();

  return {
    add(parent: TParent, child: TChild, writeKey: DependencyWriteKey) {
      let map = parentToChildMap.get(parent);
      if (!map) {
        map = new Map();
        parentToChildMap.set(parent, map);
      }

      map.set(child, writeKey);
    },
    writeForChild(child) {
      const nextKey = ((keyMap.get(child) ?? 0) + 1) as DependencyWriteKey;
      keyMap.set(child, nextKey);
      return nextKey;
    },
    forEachChild(parent, callback) {
      const map = parentToChildMap.get(parent);
      map?.forEach((writeKey, child) =>
        writeKey !== (keyMap.get(child) ?? -1)
          ? map.delete(child)
          : callback(child)
      );
    },
  };
};
