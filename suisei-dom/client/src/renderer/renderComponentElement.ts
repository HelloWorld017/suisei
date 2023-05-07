import { createPrimitives, SuspenseContext } from 'suisei/unsafe-internals';
import { createOwner } from '../owner';
import type { ClientRenderer } from '../types';
import type { Component, PropsBase } from 'suisei';
import type { ContextRegistry, Propize } from 'suisei/unsafe-internals';

export const renderComponentElement = async <P extends PropsBase>(
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry,
  component: Component<P>,
  props: Propize<P>
) => {
  const owner = createOwner(
    renderer.scheduler,
    promise => {
      const suspense = contextRegistry[
        SuspenseContext.key
      ] as SuspenseContextType;
    },
    error => {}
  );
  const primitives = createPrimitives(contextRegistry, owner);

  let element = component(props, primitives);
  if (isPromise(element)) {
    element = await element;
  }
};
