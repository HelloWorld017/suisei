export type TaskNode = {
  append(task: SchedulerTask): void;
};

export type SchedulerTask = (scheduler: Scheduler, node: TaskNode) => void;

export type SchedulerPriority = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Scheduler = {
  queueTask(priority: SchedulerPriority, task: SchedulerTask): void;
  queueTaskForRender(task: SchedulerTask): void;
};
