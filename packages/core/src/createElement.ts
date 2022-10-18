import { SymbolElement, SymbolIs } from '@suisei/shared';
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

export const createFragmentElement = (
  providingValue: null | Record<symbol, unknown>,
  props: Propize<PropsWithKey<FragmentProps>>
): Element => ({
  [SymbolIs]: SymbolElement,
  component: null,
  props,
  provide: providingValue,
  key: props.key,
});

export const createElement = <P extends PropsBase = PropsBase>(
  component: string | Component<P>,
  propsWithoutChildren: Propize<PropsWithKey<Omit<P, 'children'>>>,
  ...children: P['children'] extends Children ? P['children'] : []
): Element => ({
  [SymbolIs]: SymbolElement,
  component,
  props: { ...propsWithoutChildren, children: children.flat() },
  provide: null,
  key: propsWithoutChildren.key as Ref<string | undefined> | undefined,
});

// TODO export const jsx =
