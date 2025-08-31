import {
  KIND_FUTURE,
  KIND_REF,
  REF_KIND_DERIVED,
  SymbolFutureDescriptor,
  SymbolIs,
  SymbolRefDescriptor,
} from '@suisei/shared';
import { isFuture } from '../utils/guards';
import { resolveFuture } from '../utils/resolveFuture';
import type {
  Future,
  FutureInternal,
  FutureUnresolvedInternal,
  UnwrapFuture,
} from '../types/Future';
import type { DerivedRefInternal, RefSelector } from '../types/Ref';
import type { Variable, VariableSelector } from '../types/Variable';

export const deriveInternal = <T>(
  deriveFn: (selector: VariableSelector) => T,
  opts: { useMemoization: boolean; useAbortSignal: boolean }
): Variable<T> => {
  // TODO Capture owner & current scheduler priority, and run re-evaluation on the scheduler.
  const evaluate = (refSelector: RefSelector, future?: FutureInternal<T>) => {
    try {
      return deriveFn(<TSelected>(variable: Variable<TSelected>) => {
        const selected = refSelector<TSelected | Future<TSelected>>(variable);

        if (isFuture(selected)) {
          const descriptor = (selected as FutureInternal<TSelected>)[
            SymbolFutureDescriptor
          ];

          if (descriptor.handlers) {
            throw selected;
          }

          return descriptor.value as UnwrapFuture<TSelected>;
        }

        return selected as UnwrapFuture<TSelected>;
      });
    } catch (err) {
      const nextFuture =
        future ??
        ({
          [SymbolIs]: KIND_FUTURE,
          [SymbolFutureDescriptor]: {
            handlers: [],
          },
        } satisfies FutureInternal<T>);

      (err as FutureUnresolvedInternal)[SymbolFutureDescriptor].handlers.push(
        () => {
          const output = evaluate(refSelector, nextFuture);
          if (!isFuture(output)) {
            resolveFuture(nextFuture, output);
          }
        }
      );

      return nextFuture;
    }
  };

  const derivedRef = {
    [SymbolIs]: KIND_REF,
    [SymbolRefDescriptor]: {
      kind: REF_KIND_DERIVED,
      isMemoized: opts.useMemoization,
      isReadwrite: false,
      derive: evaluate,
    },
  } satisfies DerivedRefInternal<T | Future<T>>;

  return derivedRef;
};
