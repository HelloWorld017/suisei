export type EffectCleanup = () => void | Promise<void>;
export type EffectHandle = { abortSignal: AbortSignal };
export type Effect = () => () => Promise<void> | void;
export type EffectRunAt = 'layout' | 'default';
