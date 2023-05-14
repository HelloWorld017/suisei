import {
  createPrimitives,
  isPromise,
  SuspenseContext,
  wrapProps,
} from 'suisei/unsafe-internals';
import { createOwner } from '../owner';
import type { ClientRenderer } from '../types';
import type { Component, PropsBase, Ref } from 'suisei';
import type {
  ContextRegistry,
  Propize,
  SuspenseContextType,
} from 'suisei/unsafe-internals';

export const renderComponentElement = async <P extends PropsBase>(
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry,
  component: Component<P>,
  props: Propize<P>
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

    const boundaryHandle = await renderer.render(suspense.element);
    const fallbackHandle = await renderer.render(suspense.fallback);
    const cleanup = boundaryHandle.alternate(fallbackHandle.renderResult);

    await promise;
    cleanup();
  };

  onError = error => {};

  let element = component(wrapProps(props), primitives);
  if (isPromise(element)) {
    element = await element;
  }
};
