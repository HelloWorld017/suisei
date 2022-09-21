import type { Primitives } from '../primitives';
import type { Children, Element } from './Element';
import type { Ref } from '@suisei/reactivity';
import type { PartialByUndefined } from '@suisei/shared';

export type Props<T extends Component> = T extends Component<infer P>
  ? P
  : never;

export type PropsBase = Record<string, Ref | Children> & {
  children?: Children;
};

type PropizeImpl<P extends PropsBase> = {
  [K in keyof P]: P[K] extends Ref<infer T> ? T | Ref<T> : P[K];
} & { children?: Children; key?: string | Ref<string> };

export type Propize<T extends PropsBase> = PartialByUndefined<PropizeImpl<T>>;
export type Depropize<T> = PartialByUndefined<
  {
    [K in keyof T]: T[K] | Ref<T[K]>;
  } & { children?: Children }
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component<P extends PropsBase = any> = (
  props: P,
  $: Primitives
) => Element | Promise<Element>;
