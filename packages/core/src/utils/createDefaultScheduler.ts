import { createLinkedList, createOrderedSet } from '@suisei/shared';
import { MAX_SCHEDULER_PRIORITY, MIN_SCHEDULER_PRIORITY } from '../constants';
import type {
  Scheduler,
  SchedulerPriority,
  SchedulerTask,
} from '../types/Scheduler';
import type { LinkedList, LinkedListNode } from '@suisei/shared';

const DEFAULT_SCHEDULER_LIMIT = 5;

type DefaultSchedulerOptions = {
  limit?: number;
  requestNextTick?: (callback: () => void) => void;
  requestNextRenderTick?: (callback: () => void) => void;
};

export const createDefaultScheduler = ({
  limit = DEFAULT_SCHEDULER_LIMIT,
  requestNextTick = setTimeout,
  requestNextRenderTick = setTimeout,
}: DefaultSchedulerOptions): Scheduler => {
  let isIdle = true;
  let isRenderIdle = true;
  const lanes = createOrderedSet<LinkedList<SchedulerTask>>();
  const renderTaskQueue = createLinkedList<SchedulerTask>();
  const taskQueue = Array.from({ length: MAX_SCHEDULER_PRIORITY + 1 }).map(() =>
    createLinkedList<SchedulerTask>()
  );

  const workLoop = (priority: SchedulerPriority, loopLimit = limit) => {
    const startedAt = performance.now();

    loopLanes: while (true) {
      const currentLane = lanes.peek();
      const currentLanePriority = -(lanes.peekPriority() ?? 1);
      if (!currentLane || currentLanePriority < priority) {
        break;
      }

      let taskNode: LinkedListNode<SchedulerTask> | null;
      while ((taskNode = currentLane.head)) {
        if (loopLimit && startedAt + loopLimit < performance.now()) {
          break loopLanes;
        }

        const currentNode = taskNode;
        currentNode.value(scheduler, {
          append: task => currentLane?.append(task, currentNode),
        });

        currentLane.delete(currentNode);
      }

      if (lanes.peek() === currentLane) {
        lanes.deleteMin();
      }
    }
  };

  const scheduleLoop = () => {
    isIdle = false;

    requestNextTick(() => {
      workLoop(MIN_SCHEDULER_PRIORITY);
      if (lanes.size() > 0) {
        scheduleLoop();
      } else {
        isIdle = true;
      }
    });
  };

  const scheduleRenderLoop = () => {
    isRenderIdle = false;

    requestNextRenderTick(() => {
      const renderPriority = MAX_SCHEDULER_PRIORITY;
      taskQueue[renderPriority].concatBefore(renderTaskQueue);
      lanes.insert(-renderPriority, taskQueue[renderPriority]);

      workLoop(renderPriority, 0);
      isRenderIdle = true;
    });
  };

  const scheduler: Scheduler = {
    queueTask: (priority, task) => {
      lanes.insert(-priority, taskQueue[priority]);
      taskQueue[priority].append(task);

      if (isIdle) {
        scheduleLoop();
      }
    },
    queueTaskForRender: task => {
      renderTaskQueue.append(task);

      if (isRenderIdle) {
        scheduleRenderLoop();
      }
    },
  };

  return scheduler;
};
