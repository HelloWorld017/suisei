import type { EffectTask } from './ReactivityRegistry';
import type { Ref } from './Ref';

export type DependencyWriteKey = symbol & { __kind?: 'DependencyWriteKey' };
export type DependencyMap = {
  add(writeKey: DependencyWriteKey, parent: Ref, child: EffectTask | Ref): void;
  rewrite(child: EffectTask | Ref): DependencyWriteKey;
  forEachChild(parent: Ref, callback: (child: EffectTask | Ref) => void): void;
  fork(): OverlayDependencyMap;
};

export type OverlayDependencyMap = Omit<DependencyMap, 'fork'> & {
  commit(): void;
};
