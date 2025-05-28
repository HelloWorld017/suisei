import type { Pipeline } from '../types/Pipeline';
import type {
  ReactivityRegistry,
  ReactivityRegistryInternal,
} from '../types/ReactivityRegistry';
import type { SchedulerTask } from '@suisei/core';

export const TaskEffect =
  (registry: ReactivityRegistry, pipeline: Pipeline): SchedulerTask =>
  (_scheduler, node) => {
    const internalRegistry = registry as ReactivityRegistryInternal;
    const tasks = internalRegistry._effectsTasks;
    const taskPriority = tasks.peekPriority();
    if (taskPriority === null || taskPriority <= pipeline) {
      return;
    }

    const task = tasks.deleteMin();
    task?.();

    node.append(TaskEffect(registry, pipeline));
  };
