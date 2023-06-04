import {
  createPrimitives,
  ErrorBoundaryContext,
  isPromise,
  SuspenseContext,
} from 'suisei/unsafe-internals';
import { ClientRenderer } from '../types';
import { createOwner } from './createOwner';
import type { Ref } from 'suisei';
import type {
  ContextRegistry,
  ErrorBoundaryContextType,
  SuspenseContextType,
} from 'suisei/unsafe-internals';

export const createBoundOwnerAndPrimitives = (
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry
) => {
  let onSuspense = (_promise: Promise<unknown>) => {};
  let onError = (_error: unknown) => {};

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

    const cleanup = suspense.alternate();
    await promise;
    cleanup();
  };

  onError = error => {
    const errorBoundary = primitives.useOnce(
      contextRegistry[ErrorBoundaryContext.key] as Ref<ErrorBoundaryContextType>
    );

    errorBoundary?.(error);
  };

  return { owner, primitives };
};
