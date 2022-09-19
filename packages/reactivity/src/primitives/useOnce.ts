import { assertsIsRef } from '@suisei/shared';
import { readRef } from '../utils';
import type { RefSelector } from '../types';

export const useOnce: PrimitiveUseOnce = ref => {
  assertsIsRef(ref);
  return readRef(ref);
};

export type PrimitiveUseOnce = RefSelector;
