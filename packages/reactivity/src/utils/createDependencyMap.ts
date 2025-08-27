import { MIN_SCHEDULER_PRIORITY, type Scheduler } from '@suisei/core';
import { TaskDispose } from '../tasks/TaskDispose';
import type {
  DependencyMap,
  DependencyMapInternal,
  DependencyWriteKey,
} from '../types/DependencyMap';

export const createDependencyMap = <
  TDependency extends object,
  TEffect extends object,
  TPipeline extends number,
>(
  scheduler: Scheduler,
  onDispose: (node: TDependency | TEffect) => void
): DependencyMap<TDependency, TEffect, TPipeline> => {
  type TNode = TEffect | TDependency;

  const parentMap = new WeakMap<TNode, Set<TDependency>>();
  const childrenMap = new WeakMap<TDependency, Map<TNode, TPipeline | null>>();
  const writeKeyMap = new WeakMap<TNode, DependencyWriteKey>();

  const dependencyMap = {
    _parentMap: new WeakMap(),
    _childrenMap: new WeakMap(),
    _writeKeyMap: new WeakMap(),

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
      parentMap.set(child, new Set());

      const writeKey = Symbol() as DependencyWriteKey;
      writeKeyMap.set(child, writeKey);

      if (parentSet) {
        scheduler.queueTask(
          MIN_SCHEDULER_PRIORITY,
          TaskDispose(dependencyMap, parentSet)
        );
      }

      return writeKey;
    },

    dispose(node: TNode) {
      if (dependencyMap.isActive(node as TDependency)) {
        return;
      }

      onDispose(node);

      const parentSet = parentMap.get(node);
      parentSet?.forEach(parent => {
        childrenMap.get(parent)?.delete(node);
      });

      parentMap.delete(node);
      writeKeyMap.delete(node);
      childrenMap.delete(node as TDependency);
    },

    traverse(parent, callback) {
      childrenMap
        .get(parent)
        ?.forEach((pipeline, child) => callback(child, pipeline));
    },

    isActive(parent) {
      return !!childrenMap.get(parent)?.size;
    },
  } satisfies DependencyMapInternal<TDependency, TEffect, TPipeline>;

  return dependencyMap;
};
