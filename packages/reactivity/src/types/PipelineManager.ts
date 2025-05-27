import type { Task } from '@suisei/core';

export type Pipeline = number & { __kind?: 'Pipeline' };
export type PipelineManager = {
  dispose(): void;
  queueTask(pipeline: Pipeline, task: Task): void;
  schedule(pipeline: Pipeline, callback: Task): void;
};
