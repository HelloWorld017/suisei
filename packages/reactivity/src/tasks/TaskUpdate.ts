import { SymbolRefDescriptor } from '@suisei/shared';
import { isDerivedRefInternal } from '../utils/isDerivedRefInternal';
import { readRefByUpdate } from '../utils/readRef';
import type { Pipeline } from '../types/Pipeline';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
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
      if (isDerivedRefInternal(task) && task[SymbolRefDescriptor].isMemoized) {
        readRefByUpdate(registry, task);
      }
    }

    node.append(TaskUpdate(registry, pipeline));
  };
