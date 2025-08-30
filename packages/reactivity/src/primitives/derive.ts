import { KIND_REF, SymbolIs, SymbolRefDescriptor } from '@suisei/shared';
import type { DerivedRefInternal } from '../types/Ref';
import type {
  Variable,
  VariableHandle,
  VariableSelector,
} from '../types/Variable';

export const deriveInternal = <T>(
  deriveFn: (selector: VariableSelector, handle?: VariableHandle) => T,
  opts: { useMemoization: boolean; useAbortSignal: boolean }
): Variable<T> =>
  ({
    [SymbolIs]: KIND_REF,
    [SymbolRefDescriptor]: {
      isMemoized,
    },
  }) satisfies DerivedRefInternal<T | Promise<T>>;
