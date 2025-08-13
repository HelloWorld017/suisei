import { createOverlayMap } from '@suisei/shared';
import type {
  DependencyMap,
  DependencyWriteKey,
  OverlayDependencyMap,
} from '../types/DependencyMap';
import type { Pipeline } from '../types/Pipeline';
import type { BindTarget } from '../types/ReactivityRegistry';
import type { Ref } from '../types/Ref';

const deleted = Symbol();

export const createDependencyMap = (): DependencyMap => {
  const parentMap = new WeakMap<BindTarget, Set<Ref>>();
  const childrenMap = new WeakMap<Ref, Map<BindTarget, Pipeline | null>>();
  const writeKeyMap = new WeakMap<BindTarget, DependencyWriteKey>();

  const fork = () => {
    const parentOverlay = new Map<BindTarget, Set<Ref>>();
    const childrenOverlay = new Map<
      Ref,
      Map<BindTarget, Pipeline | null | typeof deleted>
    >();
    const writeKeyOverlay = createOverlayMap(writeKeyMap);

    return {
      add(parent, child, pipeline = null, writeKey) {
        if (writeKey && writeKeyOverlay.get(child) !== writeKey) {
          return;
        }

        let parentSet = parentOverlay.get(child);
        if (!parentSet) {
          parentSet = new Set(parentMap.get(child));
          parentOverlay.set(child, parentSet);
        }

        let childrenSet = childrenOverlay.get(parent);
        if (!childrenSet) {
          childrenSet = new Map();
          childrenOverlay.set(parent, childrenSet);
        }

        parentSet.add(parent);
        childrenSet.set(child, pipeline);
      },

      rewrite(child) {
        const parentBaseSet = parentMap.get(child);
        const parentOverlaySet = parentOverlay.get(child);
        (parentOverlaySet ?? parentBaseSet)?.forEach(parent =>
          childrenOverlay.get(parent)?.set(child, deleted)
        );

        if (parentOverlaySet) {
          parentOverlaySet.clear();
        } else {
          parentOverlay.set(child, new Set());
        }

        const writeKey = Symbol() as DependencyWriteKey;
        writeKeyMap.set(child, writeKey);

        return writeKey;
      },

      traverse(parent, callback) {
        const childrenOverlaySet = childrenOverlay.get(parent);
        childrenMap.get(parent)?.forEach((pipeline, child) => {
          if (childrenOverlaySet?.get(child) !== deleted) {
            callback(child, pipeline);
          }
        });

        childrenOverlaySet?.forEach((pipeline, child) => {
          if (pipeline !== deleted) {
            callback(child, pipeline);
          }
        });
      },

      isActive(parent) {
        const childrenOverlaySet = childrenOverlay.get(parent);
        if (childrenOverlaySet) {
          for (const pipeline of childrenOverlaySet.values()) {
            if (pipeline !== deleted) {
              return true;
            }
          }
        }

        const childrenSet = childrenMap.get(parent);
        if (childrenSet) {
          for (const child of childrenSet.keys()) {
            if (childrenOverlaySet?.get(child) !== deleted) {
              return true;
            }
          }
        }

        return false;
      },

      commit() {
        parentOverlay.forEach((overlay, child) => {
          parentMap.set(child, overlay);
        });

        childrenOverlay.forEach((overlay, parent) => {
          let childrenSet = childrenMap.get(parent);
          if (!childrenSet) {
            childrenSet = new Map();
            childrenMap.set(parent, childrenSet);
          }

          overlay.forEach((pipeline, child) => {
            if (pipeline === deleted) {
              childrenSet.delete(child);
              return;
            }

            childrenSet.set(child, pipeline);
          });
        });

        writeKeyOverlay.commit();
      },
    } satisfies OverlayDependencyMap;
  };

  return {
    add(parent, child, pipeline = null, writeKey) {
      if (writeKey && writeKeyMap.get(child) !== writeKey) {
        return;
      }

      let childrenSet = childrenMap.get(parent);
      if (!childrenSet) {
        childrenSet = new Map();
        childrenMap.set(parent, childrenSet);
      }

      let parentSet = parentMap.get(child);
      if (!parentSet) {
        parentSet = new Set();
        parentMap.set(child, parentSet);
      }

      childrenSet.set(child, pipeline);
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

    traverse(parent, callback) {
      childrenMap
        .get(parent)
        ?.forEach((pipeline, child) => callback(child, pipeline));
    },

    isActive(parent) {
      return !!childrenMap.get(parent)?.size;
    },

    fork,
  };
};
