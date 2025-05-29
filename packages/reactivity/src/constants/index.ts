import type { Pipeline } from '../types/Pipeline';

export const PIPELINE_UPDATE = 0 as Pipeline;
export const PIPELINE_CREATE = 1 as Pipeline;
export const PIPELINE_RENDER = 2 as Pipeline;
export const PIPELINE_EFFECT = 3 as Pipeline;

export const MIN_PIPELINE = PIPELINE_UPDATE;
export const MAX_PIPELINE = PIPELINE_EFFECT + 1;
