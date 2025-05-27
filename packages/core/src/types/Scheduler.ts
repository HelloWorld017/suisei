export type Task = () => void;

export type SchedulerPriority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Scheduler = {
  queueTask(priority: SchedulerPriority, task: Task): void;
  queueTaskForRender(task: Task): void;
};
