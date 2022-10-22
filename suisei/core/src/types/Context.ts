import type { WrapProps } from './Component';
import type { Children, Element } from './Element';
import type { Ref } from './Ref';

export type Context<T> = {
  readonly key: unique symbol;
  name?: string;
  defaultValue: Ref<T>;
};
export type ContextRegistry = Record<symbol, Ref<unknown>>;
export type ContextProvider<T> = (
  props: WrapProps<{ value: T; children: Children }>
) => Element;
