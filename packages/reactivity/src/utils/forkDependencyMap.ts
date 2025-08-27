import { createOverlayMap, SymbolDeleted } from '@suisei/shared';
import type {
  DependencyMap,
  DependencyMapInternal,
  DependencyWriteKey,
  OverlayDependencyMap,
} from '../types/DependencyMap';
import type { OverlayMap } from '@suisei/shared';

export const forkDependencyMap = <
  TDependency extends object,
  TEffect extends object,
  TPipeline extends number,
>(
  origin: DependencyMap<TDependency, TEffect, TPipeline>
) => {
  type TNode = TDependency | TEffect;

  const originInternal = origin as DependencyMapInternal<
    TDependency,
    TEffect,
    TPipeline
  >;

  const parentOverlay = new Map<TNode, Set<TDependency>>();
  const childrenOverlay = new Map<
    TDependency,
    Map<TNode, TPipeline | null | typeof SymbolDeleted>
  >();

  const writeKeyOverlay = createOverlayMap<object, DependencyWriteKey>(
    originInternal._writeKeyMap
  ) as OverlayMap<TNode, DependencyWriteKey>;

  const disposedNodes = new Set<TNode>();

  const dependencyMap = {
    add(parent, child, pipeline = null, writeKey) {
      if (writeKey && writeKeyOverlay.get(child) !== writeKey) {
        return;
      }

      let parentSet = parentOverlay.get(child);
      if (!parentSet) {
        parentSet = new Set(originInternal._parentMap.get(child));
        parentOverlay.set(child, parentSet);
      }

      let childrenSet = childrenOverlay.get(parent);
      if (!childrenSet) {
        childrenSet = new Map();
        childrenOverlay.set(parent, childrenSet);
      }

      parentSet.add(parent);
      childrenSet.set(child, pipeline);
      disposedNodes.delete(child);
    },

    rewrite(child) {
      const parentBaseSet = originInternal._parentMap.get(child);
      const parentOverlaySet = parentOverlay.get(child);
      (parentOverlaySet ?? parentBaseSet)?.forEach(parent => {
        let childrenSet = childrenOverlay.get(parent);
        if (!childrenSet) {
          childrenSet = new Map();
          childrenOverlay.set(parent, childrenSet);
        }

        childrenSet?.set(child, SymbolDeleted);
      });

      if (parentOverlaySet) {
        parentOverlaySet.clear();
      } else {
        parentOverlay.set(child, new Set());
      }

      const writeKey = Symbol() as DependencyWriteKey;
      writeKeyOverlay.set(child, writeKey);

      return writeKey;
    },

    dispose(node: TNode) {
      writeKeyOverlay.set(node, Symbol() as DependencyWriteKey);
      disposedNodes.add(node);
    },

    traverse(parent, callback) {
      const childrenOverlaySet = childrenOverlay.get(parent);
      childrenOverlaySet?.forEach((pipeline, child) => {
        if (!disposedNodes.has(child) && pipeline !== SymbolDeleted) {
          callback(child, pipeline);
        }
      });

      originInternal._childrenMap.get(parent)?.forEach((pipeline, child) => {
        if (
          !disposedNodes.has(child) &&
          childrenOverlaySet?.get(child) !== SymbolDeleted
        ) {
          callback(child, pipeline);
        }
      });
    },

    isActive(parent) {
      const childrenOverlaySet = childrenOverlay.get(parent);
      if (childrenOverlaySet) {
        for (const [node, pipeline] of childrenOverlaySet) {
          if (!disposedNodes.has(node) && pipeline !== SymbolDeleted) {
            return true;
          }
        }
      }

      const childrenSet = originInternal._childrenMap.get(parent);
      if (childrenSet) {
        for (const child of childrenSet.keys()) {
          if (
            !disposedNodes.has(child) &&
            childrenOverlaySet?.get(child) !== SymbolDeleted
          ) {
            return true;
          }
        }
      }

      return false;
    },

    commit() {
      parentOverlay.forEach((overlay, child) => {
        originInternal._parentMap.set(child, overlay);
      });

      childrenOverlay.forEach((overlay, parent) => {
        let childrenSet = originInternal._childrenMap.get(parent);
        if (!childrenSet) {
          childrenSet = new Map();
          originInternal._childrenMap.set(parent, childrenSet);
        }

        overlay.forEach((pipeline, child) => {
          if (pipeline === SymbolDeleted) {
            childrenSet.delete(child);
            return;
          }

          childrenSet.set(child, pipeline);
        });
      });

      disposedNodes.forEach(node => {
        originInternal.dispose(node);
      });

      writeKeyOverlay.commit();
    },
  } satisfies OverlayDependencyMap<TDependency, TNode, TPipeline>;

  return dependencyMap;
};
