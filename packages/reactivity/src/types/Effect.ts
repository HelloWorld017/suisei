export type EffectCleanup = () => void | Promise<void>;
export type EffectHandle = {
  abortSignal: AbortSignal;
};

export type Effect = () => EffectCleanup;
export type EffectRunAt = 'render' | 'default';
