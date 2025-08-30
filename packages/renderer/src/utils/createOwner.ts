import { readContext, setState } from '@suisei/reactivity';
import { ErrorBoundaryContext } from '../contexts/ErrorBoundaryContext';
import type { EffectTask, Owner, Ref } from '@suisei/reactivity';

export const createOwner = (
  parent: Owner | null,
  provides: Record<symbol, unknown> | null
): Owner => {
  const context = provides
    ? { ...parent?.context, ...provides }
    : (parent?.context ?? {});

  const refs = new Set<Ref>();
  const effects = new Set<EffectTask>();

  const owner = {
    context,
    refs,
    effects,
    onError(registry, error) {
      const errorState = readContext(owner, ErrorBoundaryContext)?.latestError;
      if (!errorState) {
        throw error;
      }

      setState(registry, errorState, { error });
    },
  } satisfies Owner;

  return owner;
};
