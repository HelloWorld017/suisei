export type EffectCleanup = () => void;
export type EffectHandle = { isCancelled(): boolean };
export type Effect = () => EffectCleanup;
