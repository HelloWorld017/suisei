import type { Scheduler } from 'suisei/unsafe-internals';

export const createScheduler = (): Scheduler => {
  type Task = () => void;
  type SchedulerTask = {
    priority: number;
    prev: SchedulerTask | null;
    next: SchedulerTask | null;
    run(): void;
  };

  const rootTask: SchedulerTask = {
    priority: number;
    prev: null,
    next: null,
    run() {},
  };

  let tailTask = rootTask;

  const createLane = (priority: number) => {
  };
  let activeLane = createLane(0);

  return {
    createLane(_priority: number) {
      // TODO implement lane
      return 0;
    },
    runWithLane(_lane: number, fn) {
      fn();
    },
    queueTask(task: Task) {
      tasks.push(task);
    },
  };
};
