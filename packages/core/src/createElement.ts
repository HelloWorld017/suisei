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
  WrapProps,
} from './types';

export const createFragmentElement = (
  providingValue: null | Record<symbol, unknown>,
  props: PropsWithKey<WrapProps<FragmentProps>>
): Element => ({
  [SymbolIs]: SymbolElement,
  component: null,
  props,
  provide: providingValue,
});

export const createElement = <P extends PropsBase = PropsBase>(
  component: string | Component<P>,
  props: PropsWithKey<Omit<Propize<P>, 'children'>>,
  ...children: P['children'] extends Children ? P['children'] : []
): Element => ({
  [SymbolIs]: SymbolElement,
  component,
  props: { ...props, children: children.flat() },
  provide: null,
  key: props.key,
});

// TODO export const jsx =
