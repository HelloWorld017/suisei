import {
  ErrorCodes,
  isConstantRef,
  isRef,
  SymbolElement,
  SymbolIs,
  throwError,
} from '@suisei/shared';
import { globalPrimitives } from './primitives';
import type {
  Children,
  Component,
  Element,
  FragmentProps,
  PropsBase,
  PropsWithKey,
  Propize,
  Ref,
} from './types';

export const createElement = <P extends PropsBase = PropsBase>(
  component: string | Component<P>,
  propsWithoutChildren: Propize<PropsWithKey<Omit<P, 'children'>>>,
  ...children: P['children'] extends Children ? P['children'] : []
): Element => {
  let key: string | undefined;

  if (isRef(propsWithoutChildren.key)) {
    if (!isConstantRef(propsWithoutChildren.key)) {
      throwError(ErrorCodes.E_KEY_NONCONSTANT_REF);
    }

    key = globalPrimitives.useOnce(
      propsWithoutChildren.key as Ref<string | undefined>
    );
  } else {
    key = propsWithoutChildren.key as string | undefined;
  }

  return {
    [SymbolIs]: SymbolElement,
    component,
    props: { ...propsWithoutChildren, children: children.flat() },
    provide: null,
    key: typeof key === 'string' ? key : null,
  };
};

export const createFragmentElement = (
  providingValue: null | Record<symbol, Ref<unknown>>,
  props: Propize<FragmentProps>,
  key?: string
): Element => ({
  [SymbolIs]: SymbolElement,
  component: null,
  props,
  provide: providingValue,
  key: typeof key === 'string' ? key : null,
});

export const jsx = <P extends PropsBase = PropsBase>(
  component: string | Component<P>,
  props: Propize<P>,
  key?: string
) => ({
  [SymbolIs]: SymbolElement,
  component,
  props,
  provide: null,
  key,
});
