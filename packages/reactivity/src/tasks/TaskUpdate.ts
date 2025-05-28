import { REF_KIND_DERIVED, SymbolRefDescriptor } from '@suisei/shared';
import { readRef } from '../utils/readRef';
import type { Pipeline } from '../types/Pipeline';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { Ref, RefInternal } from '../types/Ref';
import type { SchedulerTask } from '@suisei/core';

export const TaskUpdate =
  (registry: ReactivityRegistry, pipeline: Pipeline): SchedulerTask =>
  (_scheduler, node) => {
    const internalRegistry = registry as ReactivityRegistryInternal;
    const tasks = internalRegistry._tasks;
    const taskPriority = tasks.peekPriority();

    if (taskPriority === null || taskPriority <= pipeline) {
      return;
    }

    const task = tasks.deleteMin();
    if (!task) {
      return;
    }

    if (typeof task === 'function') {
      task();
    } else {
      const internalRef = task satisfies Ref as RefInternal;
      if (
        internalRef[SymbolRefDescriptor].kind === REF_KIND_DERIVED &&
        internalRef[SymbolRefDescriptor].isMemoized
      ) {
        readRef(registry, internalRef);
      }
    }

    node.append(TaskUpdate(registry, pipeline));
  };
