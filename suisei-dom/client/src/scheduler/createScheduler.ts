import type {
  Scheduler,
  SchedulerPriority,
  Task,
} from 'suisei/unsafe-internals';

const MIN_PRIORITY: SchedulerPriority = 0;
const DEFAULT_PRIORITY: SchedulerPriority = 4;
const MAX_PRIORITY: SchedulerPriority = 7;

const RENDER_FRAME_LIMIT = 1000 / 60;

type Deadline = { timeRemaining(): number };

type NonRootSchedulerTask = {
  prev: SchedulerTask;
  next: NonRootSchedulerTask | null;
  run: Task;
};

type RootSchedulerTask = {
  prev: null;
  next: NonRootSchedulerTask | null;
  run: null;
};

type SchedulerTask = RootSchedulerTask | NonRootSchedulerTask;

type SchedulerLane = {
  priority: SchedulerPriority;
  rootTask: RootSchedulerTask;
  tailTask: SchedulerTask;
};

type ClientScheduler = Scheduler & {
  onIdle(deadline: Deadline): void;
  onRenderFrame(): void;
};

export const createScheduler = (): ClientScheduler => {
  const lanes: SchedulerLane[] = [];
  const createLane = (priority: SchedulerPriority): SchedulerLane => {
    const laneIndex = MAX_PRIORITY - priority;
    if (lanes[laneIndex]) {
      return lanes[laneIndex];
    }

    const rootTask = { prev: null, next: null, run: null };
    const lane = { rootTask, tailTask: rootTask, priority };
    lanes[laneIndex] = lane;

    return lane;
  };

  const addTaskToLane = ({ tailTask }: SchedulerLane, task: Task) => {
    const schedulerTask = { prev: tailTask, next: null, run: task };
    tailTask.next = schedulerTask;
  };

  let activeLane = createLane(DEFAULT_PRIORITY);

  const runTasks = (minPriority: SchedulerPriority, deadline: Deadline) => {
    lanes.every(lane => {
      if (lane.priority < minPriority) {
        return true;
      }

      let task = lane.rootTask.next;
      while (task) {
        if (deadline.timeRemaining() <= 0) {
          return false;
        }

        task.run();
        task.prev.next = task.next;
        if (task.next) {
          task.next.prev = task.prev;
        }

        task = task.next;
      }

      return true;
    });
  };

  const onIdle = (deadline: Deadline) => runTasks(MIN_PRIORITY, deadline);
  const onRenderFrame = () => {
    const renderFrameStart = performance.now();
    const renderFrameFinish = renderFrameStart + RENDER_FRAME_LIMIT;
    const deadline: Deadline = {
      timeRemaining: () => Math.max(0, renderFrameFinish - performance.now()),
    };

    return runTasks(DEFAULT_PRIORITY, deadline);
  };

  return {
    runWithPriority(priority: SchedulerPriority, fn: Task) {
      const previousActiveLane = activeLane;
      activeLane = createLane(priority);
      fn();
      activeLane = previousActiveLane;
    },

    queueTask(task: Task) {
      addTaskToLane(activeLane, task);
    },

    onIdle,
    onRenderFrame,
  };
};
