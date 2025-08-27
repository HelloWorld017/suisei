import type { DependencyMap } from '../types/DependencyMap';
import type { SchedulerTask } from '@suisei/core';

export const TaskDispose =
  <TDependency, TEffect, TPipeline extends number>(
    dependencyMap: DependencyMap<TDependency, TEffect, TPipeline>,
    refs: Set<TDependency>
  ): SchedulerTask =>
  () => {
    refs.forEach(ref => dependencyMap.dispose(ref));
  };
