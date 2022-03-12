export type EffectCleanup = () => void;
export type EffectHandle = { isCancelled(): boolean };
export type Effect = () => () => Promise<void> | void;
