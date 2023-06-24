import {
  createPrimitives,
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

type OnSuspense = (promise: Promise<unknown>) => void;
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
};

export const createRenderEnv = (
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry
): RenderEnv => {
  let onSuspense: OnSuspense = () => {};
  let onError: OnError = () => {};

  const owner = createOwner(
    renderer.scheduler,
    promise => onSuspense(promise),
    error => onError(error)
  );

  const primitives = createPrimitives(contextRegistry, owner);
  onSuspense = async promise => {
    const suspense = primitives.useOnce(
      contextRegistry[SuspenseContext.key] as Ref<SuspenseContextType>
    );

    const suspenseCount = primitives.useOnce(suspense.suspenseCount);
    if (suspenseCount === 0) {
      suspense.setRenderResult(suspense.fallback);
    }

    suspense.setSuspenseCount(suspenseCount + 1);
    await promise;

    const updatedSuspenseCount = primitives.useOnce(suspense.suspenseCount) - 1;
    suspense.setSuspenseCount(updatedSuspenseCount);

    if (updatedSuspenseCount === 0) {
      suspense.setRenderResult(suspense.element);
    }
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
  };
};
