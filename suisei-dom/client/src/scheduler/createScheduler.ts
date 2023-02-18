import type { Scheduler, SchedulerPriority } from 'suisei/unsafe-internals';

const DEFAULT_PRIORITY: SchedulerPriority = 4;

type Task = () => void;
type SchedulerLane = {
  rootTask: SchedulerTask;
  tailTask: SchedulerTask;
};

type SchedulerTask = {
  prev: SchedulerTask | null;
  next: SchedulerTask | null;
  run: Task;
};

type ClientScheduler = Scheduler & {
  onIdle(deadline: { timeRemaining(): number }): void;
  onRenderFrame(): void;
};

export const createScheduler = (): ClientScheduler => {
  const lanes: SchedulerLane[] = [];
  const createLane = (priority: number): SchedulerLane => {
    if (lanes[priority]) {
      return lanes[priority];
    }

    const rootTask = { prev: null, next: null, run: () => {} };
    const lane = { rootTask, tailTask: rootTask };
    lanes[priority] = lane;

    return lane;
  };

  const addTaskToLane = ({ tailTask }: SchedulerLane, task: Task) => {
    const schedulerTask = { prev: tailTask, next: null, run: task };
    tailTask.next = schedulerTask;
  };

  const activeLane = createLane(DEFAULT_PRIORITY);

  const onRenderFrame = () => {};

  return {
    runWithPriority(priority: number, fn: Task) {
      addTaskToLane(createLane(priority), fn);
    },

    queueTask(task: Task) {
      addTaskToLane(activeLane, task);
    },
  };
};
