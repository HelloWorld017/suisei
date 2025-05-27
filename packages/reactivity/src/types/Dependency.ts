import type { Task } from '@suisei/core';

export type Dependency = {
  pipeline: number;
  task: Task;
};
