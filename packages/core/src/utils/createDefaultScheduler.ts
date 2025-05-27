import type { Scheduler } from '../types/Scheduler';

export const createDefaultScheduler = (): Scheduler => ({
  queueTask: (_, task) => task(),
  queueTaskForRender: task => task(),
});
