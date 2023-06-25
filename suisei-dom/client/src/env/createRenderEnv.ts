import {
  createPrimitives,
  EffectCleanup,
  ErrorBoundaryContext,
  SuspenseContext,
} from 'suisei/unsafe-internals';
import { ClientRenderer } from '../types';
import { createOwner } from './createOwner';
import type { Primitives, Ref } from 'suisei';
import type {
  ContextRegistry,
  ErrorBoundaryContextType,
  SuspenseContextType,
  Owner,
} from 'suisei/unsafe-internals';

type OnSuspense = (futureSymbol: symbol, promise: Promise<unknown>) => void;
type OnError = (error: unknown) => void;

export type RenderEnv = {
  renderer: ClientRenderer;
  contextRegistry: ContextRegistry;
  owner: Owner;
  primitives: Primitives;
  callbacks: {
    onSuspense: OnSuspense;
    onError: OnError;
  };
  unmount: EffectCleanup;
};

export const createRenderEnv = (
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry
): RenderEnv => {
  let onSuspense: OnSuspense = () => {};
  let onError: OnError = () => {};

  const [owner, unmount] = createOwner(
    renderer.scheduler,
    (futureSymbol, promise) => onSuspense(futureSymbol, promise),
    error => onError(error)
  );

  const primitives = createPrimitives(contextRegistry, owner);
  const suspenseMap = new Map<symbol, number>();
  onSuspense = async (futureSymbol, promise) => {
    const suspense = primitives.useOnce(
      contextRegistry[SuspenseContext.key] as Ref<SuspenseContextType>
    );

    const suspenseCount = primitives.useOnce(suspense.suspenseCount);
    if (suspenseCount === 0) {
      suspense.setRenderResult(suspense.fallback);
    }

    const futureSuspenseCount = suspenseMap.get(futureSymbol) ?? 0;
    if (!futureSuspenseCount) {
      suspense.setSuspenseCount(suspenseCount + 1);
    }
    suspenseMap.set(futureSymbol, futureSuspenseCount + 1);

    await promise;

    const futureSuspenseCountUpdated = (suspenseMap.get(futureSymbol) ?? 0) - 1;
    if (!futureSuspenseCountUpdated) {
      const suspenseCountUpdated =
        primitives.useOnce(suspense.suspenseCount) - 1;

      suspense.setSuspenseCount(suspenseCountUpdated);
      if (!suspenseCountUpdated) {
        suspense.setRenderResult(suspense.element);
      }
    }
    suspenseMap.set(futureSymbol, futureSuspenseCountUpdated);
  };

  onError = error => {
    const errorBoundary = primitives.useOnce(
      contextRegistry[ErrorBoundaryContext.key] as Ref<ErrorBoundaryContextType>
    );

    errorBoundary?.(error);
  };

  return {
    renderer,
    contextRegistry,
    owner,
    primitives,
    callbacks: { onSuspense, onError },
    unmount,
  };
};
