import type { Pipeline } from '@suisei/reactivity';

export const RENDER_PIPELINE_DEPTH = 4;
export const PIPELINE_UPDATE = 0 as Pipeline;
export const PIPELINE_CREATE = 1 as Pipeline;
export const PIPELINE_RENDER = 2 as Pipeline;
export const PIPELINE_EFFECT = 3 as Pipeline;
