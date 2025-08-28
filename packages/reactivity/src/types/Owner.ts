import type { ReactivityRegistry } from './ReactivityRegistry';

export type Owner = {
  context: Record<string, unknown>;

  onError(registry: ReactivityRegistry, error: unknown): void;
};
