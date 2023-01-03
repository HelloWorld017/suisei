import { assertsIsRef } from '@suisei/shared';
import { readRef } from '../utils';
import type { Owner, RefSelector } from '../types';

export const useOnce =
  (owner: Owner): PrimitiveUseOnce =>
  ref => {
    assertsIsRef(ref);
    return readRef(owner, ref);
  };

export type PrimitiveUseOnce = RefSelector;
