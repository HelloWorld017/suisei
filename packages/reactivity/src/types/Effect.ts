export type EffectCleanup = () => void | Promise<void>;
export type EffectHandle = {
  abortSignal: AbortSignal;
};

export type Effect = (
  handle: EffectHandle
) => undefined | EffectCleanup | Promise<undefined | EffectCleanup>;

export type EffectRunAt = 'render' | 'default';
export type EffectTask = () => void & { __kind?: 'EffectTask' };
