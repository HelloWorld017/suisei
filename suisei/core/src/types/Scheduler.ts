export type SchedulerPriority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Scheduler = {
  runWithPriority(priority: SchedulerPriority, fn: () => void): void;
  queueTask(task: () => void): void;
};
