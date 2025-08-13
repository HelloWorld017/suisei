import type { Pipeline } from './Pipeline';
import type { BindTarget } from './ReactivityRegistry';
import type { Ref } from './Ref';

export type DependencyWriteKey = symbol & { __kind?: 'DependencyWriteKey' };
export type DependencyMap = {
  add(
    parent: Ref,
    child: BindTarget,
    pipeline?: Pipeline | null,
    writeKey?: DependencyWriteKey
  ): void;
  rewrite(child: BindTarget): DependencyWriteKey;
  traverse(
    parent: Ref,
    callback: (child: BindTarget, pipeline: Pipeline | null) => void
  ): void;
  isActive(parent: Ref): boolean;
  fork(): OverlayDependencyMap;
};

export type OverlayDependencyMap = Omit<DependencyMap, 'fork'> & {
  commit(): void;
};
