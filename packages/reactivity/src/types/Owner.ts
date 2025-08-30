import type { EffectTask } from './Effect';
import type { ReactivityRegistry } from './ReactivityRegistry';
import type { Ref } from './Ref';

export type Owner = {
  context: Record<symbol, unknown>;
  refs: Set<Ref>;
  effects: Set<EffectTask>;

  onError(registry: ReactivityRegistry, error: unknown): void;
};
