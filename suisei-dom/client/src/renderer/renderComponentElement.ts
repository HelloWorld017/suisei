import { isPromise, wrapProps } from 'suisei/unsafe-internals';
import { createBoundOwnerAndPrimitives } from '../owner';
import type { ClientRenderer } from '../types';
import type { Component, PropsBase } from 'suisei';
import type { ContextRegistry, Propize } from 'suisei/unsafe-internals';

export const renderComponentElement = async <P extends PropsBase>(
  renderer: ClientRenderer,
  contextRegistry: ContextRegistry,
  component: Component<P>,
  props: Propize<P>
) => {
  const { primitives } = createBoundOwnerAndPrimitives(
    renderer,
    contextRegistry
  );

  let element = component(
    wrapProps(props, primitives) as PropsBase as P,
    primitives
  );

  if (isPromise(element)) {
    element = await element;
  }

  return renderer.render(element);
};
