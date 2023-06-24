import { isPromise, wrapProps } from 'suisei/unsafe-internals';
import { RenderEnv } from '../env';
import type { Component, PropsBase } from 'suisei';
import type { Propize } from 'suisei/unsafe-internals';

export const renderComponentElement = async <P extends PropsBase>(
  { renderer, primitives }: RenderEnv,
  component: Component<P>,
  props: Propize<P>
) => {
  let element = component(
    wrapProps(props, primitives) as PropsBase as P,
    primitives
  );

  if (isPromise(element)) {
    element = await element;
  }

  return renderer.render(element);
};
